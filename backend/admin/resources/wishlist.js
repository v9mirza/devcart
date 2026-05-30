const Wishlist = require("../../models/Wishlist");

const readOnlyActions = {
  new: { isAccessible: false },
  edit: { isAccessible: false },
};

module.exports = {
  resource: Wishlist,
  options: {
    navigation: { name: "Customers", icon: "User" },
    listProperties: ["user", "updatedAt", "createdAt"],
    showProperties: ["user", "products", "createdAt", "updatedAt"],
    filterProperties: ["user"],
    sort: { sortBy: "updatedAt", direction: "desc" },
    actions: readOnlyActions,
    properties: {
      user: { reference: "User" },
      products: { reference: "Product", isVisible: { edit: false } },
    },
  },
};
