import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500", "http://127.0.0.1:5500", process.env.ORIGIN1],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));
app.use(cookieParser());


import healthRouter from "./routes/health.route.js";
import userRouter from "./routes/user.route.js";
import organisationRouter from "./routes/organisation.route.js";
import noticeRouter from "./routes/notice.route.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import customerRouter from "./routes/customer.route.js";
import orderRouter from "./routes/order.route.js";
import inventoryRouter from "./routes/inventory.route.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/organisations", organisationRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use(errorHandler);

export { app };
