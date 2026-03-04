import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth/index.js";

const router = Router();

// Better Auth handles all /api/auth/* routes automatically
router.all("/api/auth/*splat", toNodeHandler(auth));

export default router;
