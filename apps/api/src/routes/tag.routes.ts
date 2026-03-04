import { Router } from "express";
import { tagService } from "../services/tag.service.js";

const router = Router();

// Public: List distinct tags
router.get("/", async (req, res) => {
    try {
        const tags = await tagService.listDistinct();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tags" });
    }
});

export default router;
