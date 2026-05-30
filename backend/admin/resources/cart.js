const Cart = require("../../models/Cart");

const readOnlyActions = {
  new: { isAccessible: false },
  edit: { isAccessible: false },
};

module.exports = {
  resource: Cart,
  options: {
    navigation: { name: "Customers", icon: "User" },
    listProperties: ["user", "updatedAt", "createdAt"],
    showProperties: ["user", "items", "createdAt", "updatedAt"],
    filterProperties: ["user", "updatedAt"],
    sort: { sortBy: "updatedAt", direction: "desc" },
    actions: readOnlyActions,
    properties: {
      user: { reference: "User" },
      items: { isVisible: { list: false, edit: false } },
    },
  },
};
