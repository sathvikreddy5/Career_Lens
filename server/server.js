// import "dotenv/config";

// import express from "express";
// import cors from "cors";

// import authRoutes from "./routes/authRoutes.js";

// const app = express();

// const PORT = process.env.PORT || 5000;

// /*
// =========================================================
// MIDDLEWARE
// =========================================================
// */

// app.use(cors());

// app.use(express.json());

// /*
// =========================================================
// HEALTH CHECK
// =========================================================
// */

// app.get("/", (req, res) => {
//   res.json({
//     message: "CareerShield API is running.",
//   });
// });

// /*
// =========================================================
// AUTH ROUTES
// =========================================================
// */

// app.use("/api/auth", authRoutes);

// /*
// =========================================================
// 404
// =========================================================
// */

// app.use((req, res) => {
//   res.status(404).json({
//     message: "Route not found.",
//   });
// });

// /*
// =========================================================
// START SERVER
// =========================================================
// */

// app.listen(PORT, () => {
//   console.log(`CareerShield server running on http://localhost:${PORT}`);
// });
