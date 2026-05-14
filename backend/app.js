import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoDb from "./config/mongoDb.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "loom-eight-theta.vercel.app"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
const port = process.env.PORT;
mongoDb();

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
