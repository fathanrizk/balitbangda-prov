import { Router } from "express";
import { documentService } from "../services/document.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public: List documents with pagination, search, and filters
router.get("/", async (req, res) => {
    try {
        const { page, limit, search, unitKerjaId, year, tag, sort } = req.query;

        const result = await documentService.list({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search as string,
            unitKerjaId: unitKerjaId as string,
            year: year ? Number(year) : undefined,
            tag: tag as string,
            sort: sort as "newest" | "oldest",
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

// Public: Get single document by ID
router.get("/:id", async (req, res) => {
    try {
        const doc = await documentService.getById(req.params.id as string);

        if (!doc) {
            res.status(404).json({ error: "Document not found" });
            return;
        }

        // Increment view count
        await documentService.incrementViews(req.params.id as string);

        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch document" });
    }
});

// Public: Track download
router.post("/:id/download", async (req, res) => {
    try {
        const doc = await documentService.getById(req.params.id as string);

        if (!doc) {
            res.status(404).json({ error: "Document not found" });
            return;
        }

        await documentService.incrementDownloads(req.params.id as string);

        res.json({ pdfUrl: doc.pdfUrl });
    } catch (error) {
        res.status(500).json({ error: "Failed to process download" });
    }
});

// Admin: Create document
router.post("/", requireAuth, async (req, res) => {
    try {
        const { title, summary, year, coverUrl, pdfUrl, unitKerjaId, tags, authors } = req.body;

        if (!title || !year) {
            res.status(400).json({ error: "Title and year are required" });
            return;
        }

        const doc = await documentService.create({
            title,
            summary,
            year,
            coverUrl,
            pdfUrl,
            unitKerjaId,
            uploadedBy: (req as any).user.id,
            tags,
            authors,
        });

        res.status(201).json(doc);
    } catch (error) {
        res.status(500).json({ error: "Failed to create document" });
    }
});

// Admin: Update document
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const doc = await documentService.update(req.params.id as string, req.body);

        if (!doc) {
            res.status(404).json({ error: "Document not found" });
            return;
        }

        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: "Failed to update document" });
    }
});

// Admin: Delete document
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        const doc = await documentService.delete(req.params.id as string);

        if (!doc) {
            res.status(404).json({ error: "Document not found" });
            return;
        }

        res.json({ message: "Document deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete document" });
    }
});

export default router;
