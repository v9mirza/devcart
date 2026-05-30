const Product = require("../../models/Product");

module.exports = {
  resource: Product,
  options: {
    navigation: { name: "Catalog", icon: "Tag" },
    listProperties: [
      "name",
      "category",
      "price",
      "countInStock",
      "rating",
      "reviewsCount",
      "createdAt",
    ],
    editProperties: [
      "name",
      "description",
      "price",
      "image",
      "category",
      "countInStock",
      "rating",
      "reviewsCount",
    ],
    showProperties: [
      "name",
      "description",
      "price",
      "image",
      "category",
      "countInStock",
      "rating",
      "reviewsCount",
      "createdAt",
      "updatedAt",
    ],
    filterProperties: ["category", "countInStock", "rating"],
    sort: { sortBy: "createdAt", direction: "desc" },
    properties: {
      name: { isTitle: true, isRequired: true },
      description: { type: "textarea", isRequired: true },
      price: {
        isRequired: true,
        props: { min: 0, step: "0.01" },
      },
      image: {
        isRequired: true,
        description: "Full image URL (https://...)",
        props: { placeholder: "https://images.unsplash.com/..." },
      },
      category: {
        isRequired: true,
        reference: "Category",
      },
      countInStock: {
        isRequired: true,
        props: { min: 0, step: 1 },
      },
      rating: {
        props: { min: 0, max: 5, step: "0.1" },
        description: "Storefront rating (0–5)",
      },
      reviewsCount: {
        props: { min: 0, step: 1 },
        description: "Displayed review count on storefront",
      },
    },
  },
};
