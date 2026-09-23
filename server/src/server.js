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
  "https://career-lens-sage.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.options("*", cors());

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Career Lens server running on port ${PORT}`);
});
