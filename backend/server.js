const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const setupAdmin = require("./admin/setup");
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

const backendOrigin = process.env.BACKEND_URL || `http://localhost:${PORT}`;
if (!allowedOrigins.includes(backendOrigin)) allowedOrigins.push(backendOrigin);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// Listen first so deploy health checks pass while AdminJS bundles.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

(async () => {
  if (process.env.DISABLE_ADMIN === "true") {
    console.log("AdminJS disabled (DISABLE_ADMIN=true)");
  } else {
    try {
      await setupAdmin(app);
    } catch (err) {
      console.error("AdminJS failed to start:", err);
    }
  }

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
})();
