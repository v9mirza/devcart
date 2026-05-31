const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Category = require("../models/Category");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");

const TREND_DAYS = 14;

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const dayKey = (date) => startOfDay(date).toISOString().slice(0, 10);

const dayLabel = (date) =>
  startOfDay(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const buildDailySeries = (days, rows, valueKey) => {
  const lookup = Object.fromEntries(rows.map((row) => [row._id, row[valueKey] ?? 0]));
  const series = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = startOfDay(new Date());
    date.setDate(date.getDate() - offset);
    const key = dayKey(date);
    series.push({
      name: dayLabel(date),
      date: key,
      [valueKey]: lookup[key] ?? 0,
    });
  }

  return series;
};

const dashboardHandler = async () => {
  const trendStart = startOfDay(new Date());
  trendStart.setDate(trendStart.getDate() - (TREND_DAYS - 1));

  const [
    productCount,
    categoryCount,
    userCount,
    orderCount,
    unpaidOrders,
    undeliveredOrders,
    paidOrders,
    lowStockCount,
    outOfStockCount,
    activeCarts,
    wishlistCount,
    revenueAgg,
    revenueByDay,
    ordersByDay,
    topProducts,
    revenueByCategory,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ isPaid: false }),
    Order.countDocuments({ isDelivered: false }),
    Order.countDocuments({ isPaid: true }),
    Product.countDocuments({ countInStock: { $gt: 0, $lte: 5 } }),
    Product.countDocuments({ countInStock: 0 }),
    Cart.countDocuments({ "items.0": { $exists: true } }),
    Wishlist.countDocuments(),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: trendStart },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: trendStart } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          units: { $sum: "$orderItems.qty" },
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] },
          },
        },
      },
      { $sort: { units: -1 } },
      { $limit: 6 },
    ]),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDoc",
        },
      },
      { $unwind: { path: "$productDoc", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "productDoc.category",
          foreignField: "_id",
          as: "categoryDoc",
        },
      },
      { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$categoryDoc.name", "Uncategorized"] },
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] },
          },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 6 },
    ]),
  ]);

  const paidRevenue = revenueAgg[0]?.total ?? 0;
  const paidOrderCount = revenueAgg[0]?.count ?? 0;
  const averageOrderValue = paidOrderCount > 0 ? paidRevenue / paidOrderCount : 0;

  return {
    stats: {
      products: productCount,
      categories: categoryCount,
      users: userCount,
      orders: orderCount,
      paidOrders,
      unpaidOrders,
      undeliveredOrders,
      lowStockProducts: lowStockCount,
      outOfStockProducts: outOfStockCount,
      activeCarts,
      wishlists: wishlistCount,
      paidRevenue,
      averageOrderValue,
    },
    revenueTrend: buildDailySeries(TREND_DAYS, revenueByDay, "revenue"),
    ordersTrend: buildDailySeries(TREND_DAYS, ordersByDay, "orders"),
    topProducts: topProducts.map((row) => ({
      name: row._id.length > 28 ? `${row._id.slice(0, 28)}…` : row._id,
      units: row.units,
      revenue: Math.round(row.revenue * 100) / 100,
    })),
    revenueByCategory: revenueByCategory.map((row) => ({
      name: row._id,
      revenue: Math.round(row.revenue * 100) / 100,
    })),
    orderStatus: [
      { name: "Paid", value: paidOrders },
      { name: "Unpaid", value: unpaidOrders },
    ],
    fulfillmentStatus: [
      { name: "Delivered", value: orderCount - undeliveredOrders },
      { name: "Pending", value: undeliveredOrders },
    ],
  };
};

module.exports = dashboardHandler;
