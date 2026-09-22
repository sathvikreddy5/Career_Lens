import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import safetyRoutes from "./routes/safetyRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import practiceRoutes from "./routes/practiceRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// -----------------------------
// CORS
// -----------------------------

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

// -----------------------------
// Middleware
// -----------------------------

app.use(express.json());

// -----------------------------
// Health Check
// -----------------------------

app.get("/", (req, res) => {
  res.json({
    message: "Career Lens API is running.",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Career Lens API",
  });
});

// -----------------------------
// Routes
// -----------------------------

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/safety", safetyRoutes);
app.use("/api/opportunity", opportunityRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/ai", aiRoutes);

// -----------------------------
// 404 Handler
// -----------------------------

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});

// -----------------------------
// Server
// -----------------------------

app.listen(PORT, () => {
  console.log(`Career Lens server running on port ${PORT}`);
});
