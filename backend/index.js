
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-e-commerce-store-one.vercel.app"
    ],
    credentials: true,
  })
);

// API routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// PayPal configuration
app.get("/api/config/paypal", (req, res) => {
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID,
  });
});

// Uploads
const __dirname = path.resolve();

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "MERN E-Commerce API is running",
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "MERN E-Commerce API",
    status: "OK",
  });
});

// Export for Vercel
export default app;

// Local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

