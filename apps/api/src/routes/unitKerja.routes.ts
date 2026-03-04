import { Router } from "express";
import { unitKerjaService } from "../services/unitKerja.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public: List all unit kerja (with document count)
router.get("/", async (req, res) => {
    try {
        const units = await unitKerjaService.list();
        res.json(units);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch unit kerja" });
    }
});

// Admin: Get single unit kerja
router.get("/:id", requireAuth, async (req, res) => {
    try {
        const unit = await unitKerjaService.getById(req.params.id as string);

        if (!unit) {
            res.status(404).json({ error: "Unit kerja not found" });
            return;
        }

        res.json(unit);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch unit kerja" });
    }
});

// Admin: Create unit kerja
router.post("/", requireAuth, async (req, res) => {
    try {
        const { name, code, headName } = req.body;

        if (!name || !code) {
            res.status(400).json({ error: "Name and code are required" });
            return;
        }

        const unit = await unitKerjaService.create({ name, code, headName });
        res.status(201).json(unit);
    } catch (error: any) {
        if (error.code === "23505") {
            // Unique constraint violation
            res.status(409).json({ error: "Unit kerja code already exists" });
            return;
        }
        res.status(500).json({ error: "Failed to create unit kerja" });
    }
});

// Admin: Update unit kerja
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const unit = await unitKerjaService.update(req.params.id as string, req.body);

        if (!unit) {
            res.status(404).json({ error: "Unit kerja not found" });
            return;
        }

        res.json(unit);
    } catch (error) {
        res.status(500).json({ error: "Failed to update unit kerja" });
    }
});

// Admin: Delete unit kerja
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        const unit = await unitKerjaService.delete(req.params.id as string);

        if (!unit) {
            res.status(404).json({ error: "Unit kerja not found" });
            return;
        }

        res.json({ message: "Unit kerja deleted" });
    } catch (error: any) {
        if (error.message === "Cannot delete unit kerja with existing documents") {
            res.status(409).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Failed to delete unit kerja" });
    }
});

export default router;
