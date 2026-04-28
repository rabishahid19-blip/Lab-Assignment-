import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});