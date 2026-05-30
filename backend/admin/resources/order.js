const Order = require("../../models/Order");

const refreshRecord = async (context) => {
  const { record, resource, currentAdmin } = context;
  const refreshed = await resource.findOne(record.id());
  return refreshed.toJSON(currentAdmin);
};

const isTruthy = (value) => value === true || value === "true";

module.exports = {
  resource: Order,
  options: {
    navigation: { name: "Sales", icon: "ShoppingCart" },
    listProperties: [
      "user",
      "totalPrice",
      "isPaid",
      "isDelivered",
      "paymentMethod",
      "createdAt",
    ],
    editProperties: ["isPaid", "isDelivered"],
    showProperties: [
      "user",
      "orderItems",
      "shippingAddress",
      "paymentMethod",
      "itemsPrice",
      "taxPrice",
      "shippingPrice",
      "totalPrice",
      "isPaid",
      "paidAt",
      "isDelivered",
      "deliveredAt",
      "createdAt",
      "updatedAt",
    ],
    filterProperties: ["isPaid", "isDelivered", "paymentMethod", "createdAt"],
    sort: { sortBy: "createdAt", direction: "desc" },
    actions: {
      new: { isAccessible: false },
      edit: {
        isAccessible: true,
        before: async (request) => {
          const payload = { ...request.payload };

          if (isTruthy(payload.isPaid)) {
            payload.paidAt = payload.paidAt || new Date();
          } else {
            payload.paidAt = null;
          }

          if (isTruthy(payload.isDelivered)) {
            payload.deliveredAt = payload.deliveredAt || new Date();
          } else {
            payload.deliveredAt = null;
          }

          request.payload = payload;
          return request;
        },
      },
      markAsPaid: {
        actionType: "record",
        component: false,
        icon: "Money",
        label: "Mark as paid",
        guard: "Mark this order as paid?",
        isAccessible: true,
        isVisible: ({ record }) => !isTruthy(record.params.isPaid),
        handler: async (request, response, context) => {
          const { record } = context;
          await Order.findByIdAndUpdate(record.id(), {
            isPaid: true,
            paidAt: new Date(),
          });
          return {
            record: await refreshRecord(context),
            notice: { message: "Order marked as paid", type: "success" },
          };
        },
      },
      markAsDelivered: {
        actionType: "record",
        component: false,
        icon: "Truck",
        label: "Mark as delivered",
        guard: "Mark this order as delivered?",
        isAccessible: true,
        isVisible: ({ record }) => !isTruthy(record.params.isDelivered),
        handler: async (request, response, context) => {
          const { record } = context;
          await Order.findByIdAndUpdate(record.id(), {
            isDelivered: true,
            deliveredAt: new Date(),
          });
          return {
            record: await refreshRecord(context),
            notice: { message: "Order marked as delivered", type: "success" },
          };
        },
      },
    },
    properties: {
      user: { reference: "User", isVisible: { edit: false } },
      orderItems: { isVisible: { list: false, edit: false } },
      shippingAddress: { isVisible: { list: false, edit: false } },
      paymentMethod: { isVisible: { edit: false } },
      itemsPrice: { isVisible: { edit: false } },
      taxPrice: { isVisible: { edit: false } },
      shippingPrice: { isVisible: { edit: false } },
      totalPrice: { isVisible: { edit: false } },
      isPaid: {
        type: "boolean",
        description: "Toggle whether the customer has paid",
      },
      paidAt: { isVisible: { edit: false } },
      isDelivered: {
        type: "boolean",
        description: "Toggle whether the order has been delivered",
      },
      deliveredAt: { isVisible: { edit: false } },
      createdAt: { isVisible: { edit: false } },
      updatedAt: { isVisible: { edit: false } },
    },
  },
};
