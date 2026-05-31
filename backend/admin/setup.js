const path = require("path");
const { MongoStore } = require("connect-mongo");

const dashboardHandler = require("./dashboard");
const categoryResource = require("./resources/category");
const productResource = require("./resources/product");
const orderResource = require("./resources/order");
const userResource = require("./resources/user");
const cartResource = require("./resources/cart");
const wishlistResource = require("./resources/wishlist");

const setupAdmin = async (app) => {
  const { default: AdminJS, ComponentLoader } = await import("adminjs");
  const AdminJSExpress = await import("@adminjs/express");
  const AdminJSMongoose = await import("@adminjs/mongoose");

  AdminJS.registerAdapter({
    Database: AdminJSMongoose.Database,
    Resource: AdminJSMongoose.Resource,
  });

  const componentLoader = new ComponentLoader();
  const Components = {
    Dashboard: componentLoader.add("Dashboard", path.join(__dirname, "components/Dashboard")),
  };

  const admin = new AdminJS({
    componentLoader,
    dashboard: {
      component: Components.Dashboard,
      handler: dashboardHandler,
    },
    resources: [
      categoryResource,
      productResource,
      orderResource,
      userResource,
      cartResource,
      wishlistResource,
    ],
    rootPath: "/admin",
    branding: {
      companyName: "DevCart Admin",
      softwareBrothers: false,
      withMadeWithLove: false,
    },
    locale: {
      language: "en",
      translations: {
        en: {
          labels: {
            Category: "Categories",
            Product: "Products",
            Order: "Orders",
            User: "Users",
            Cart: "Carts",
            Wishlist: "Wishlists",
          },
        },
      },
    },
  });

  admin.watch();

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { email, role: "admin" };
        }
        return false;
      },
      cookieName: "adminjs",
      cookiePassword:
        process.env.SESSION_SECRET || "fallback_secret_must_be_changed",
    },
    null,
    {
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "fallback_secret_must_be_changed",
    }
  );

  app.use(admin.options.rootPath, adminRouter);

  console.log(
    `AdminJS started on http://localhost:${process.env.PORT || 5000}${admin.options.rootPath}`
  );
};

module.exports = setupAdmin;
