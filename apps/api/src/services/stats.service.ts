import { db } from "../db/index.js";
import { document } from "../db/schema.js";
import { sql } from "drizzle-orm";

export const statsService = {
    async getDashboardStats() {
        const [result] = await db
            .select({
                totalDocuments: sql<number>`count(*)`,
                totalDownloads: sql<number>`coalesce(sum(${document.downloadCount}), 0)`,
                totalViews: sql<number>`coalesce(sum(${document.viewCount}), 0)`,
            })
            .from(document);

        return {
            totalDocuments: Number(result.totalDocuments),
            totalDownloads: Number(result.totalDownloads),
            totalViews: Number(result.totalViews),
        };
    },
};
