import { Router } from "express";
import { statsService } from "../services/stats.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Admin: Get dashboard statistics
router.get("/", requireAuth, async (req, res) => {
    try {
        const stats = await statsService.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

export default router;
