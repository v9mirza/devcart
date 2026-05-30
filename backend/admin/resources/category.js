const Category = require("../../models/Category");

module.exports = {
  resource: Category,
  options: {
    navigation: { name: "Catalog", icon: "Tag" },
    listProperties: ["name", "description", "createdAt"],
    editProperties: ["name", "description"],
    showProperties: ["name", "description", "createdAt", "updatedAt"],
    filterProperties: ["name"],
    sort: { sortBy: "name", direction: "asc" },
    properties: {
      name: { isTitle: true, isRequired: true },
      description: { type: "textarea" },
    },
  },
};
