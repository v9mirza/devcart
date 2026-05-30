const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Category = require("../models/Category");

const dashboardHandler = async () => {
  const [
    productCount,
    categoryCount,
    userCount,
    orderCount,
    unpaidOrders,
    undeliveredOrders,
    lowStockCount,
    revenueAgg,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ isPaid: false }),
    Order.countDocuments({ isDelivered: false }),
    Product.countDocuments({ countInStock: { $lte: 5 } }),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
  ]);

  const paidRevenue = revenueAgg[0]?.total ?? 0;

  return {
    message: "DevCart store overview",
    stats: {
      products: productCount,
      categories: categoryCount,
      users: userCount,
      orders: orderCount,
      unpaidOrders,
      undeliveredOrders,
      lowStockProducts: lowStockCount,
      paidRevenue: `$${paidRevenue.toFixed(2)}`,
    },
  };
};

module.exports = dashboardHandler;
