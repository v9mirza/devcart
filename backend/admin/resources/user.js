const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const hashPassword = async (payload) => {
  if (!payload?.password) {
    delete payload?.password;
    return payload;
  }
  payload.password = await bcrypt.hash(payload.password, 10);
  return payload;
};

module.exports = {
  resource: User,
  options: {
    navigation: { name: "Customers", icon: "User" },
    listProperties: ["name", "email", "isAdmin", "createdAt"],
    editProperties: [
      "name",
      "email",
      "password",
      "isAdmin",
      "shippingAddress.address",
      "shippingAddress.city",
      "shippingAddress.postalCode",
      "shippingAddress.country",
    ],
    showProperties: [
      "name",
      "email",
      "isAdmin",
      "shippingAddress",
      "createdAt",
      "updatedAt",
    ],
    filterProperties: ["name", "email", "isAdmin"],
    sort: { sortBy: "createdAt", direction: "desc" },
    actions: {
      new: {
        before: async (request) => {
          if (request.payload) {
            await hashPassword(request.payload);
          }
          return request;
        },
      },
      edit: {
        before: async (request) => {
          if (request.payload) {
            if (!request.payload.password) {
              delete request.payload.password;
            } else {
              await hashPassword(request.payload);
            }
          }
          return request;
        },
      },
    },
    properties: {
      name: { isTitle: true, isRequired: true },
      email: { isRequired: true },
      password: {
        isVisible: { list: false, show: false, filter: false },
        description: "Leave blank when editing to keep the current password",
      },
      isAdmin: {
        description: "Grants admin access to storefront API routes",
      },
      "shippingAddress.address": { description: "Street address" },
      "shippingAddress.city": {},
      "shippingAddress.postalCode": {},
      "shippingAddress.country": {},
    },
  },
};
