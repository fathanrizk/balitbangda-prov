import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import documentRoutes from "./routes/document.routes.js";
import unitKerjaRoutes from "./routes/unitKerja.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — support multiple origins (comma-separated in env)
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5174")
    .split(",")
    .map((o) => o.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
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

// Routes
app.use(authRoutes); // Better Auth handles /api/auth/*
app.use("/api/documents", documentRoutes);
app.use("/api/unit-kerja", unitKerjaRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/stats", statsRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Only listen when NOT running on Vercel
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 API server running on http://localhost:${PORT}`);
    });
}

export default app;

