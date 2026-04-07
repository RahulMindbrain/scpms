import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectToDb from "./db/connectToDb.js";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import CompanyRoutes from "./routes/company.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import StudentRoutes from "./routes/student.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // This allows requests from localhost:5173
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow certain methods
    credentials: true, // Allow sending cookies (if needed)
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToDb();

app.get("/health", (_req, res) => {
  res.send("listening");
});
app.use("/auth", AuthRoutes);
app.use("/users", UserRoutes);
app.use("/admin", adminRoutes);
app.use("/company", CompanyRoutes);
app.use("/student", StudentRoutes);

export default app;
