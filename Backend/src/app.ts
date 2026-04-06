import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectToDb from "./db/connectToDb.js";
import cookieParser from "cookie-parser";

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

export default app;
