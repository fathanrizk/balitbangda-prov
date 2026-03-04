import { db } from "../db/index.js";
import { documentTag } from "../db/schema.js";
import { sql } from "drizzle-orm";

export const tagService = {
    async listDistinct() {
        // Use LOWER() + INITCAP() to deduplicate case-insensitive tags
        const tags = await db
            .selectDistinctOn([sql`lower(${documentTag.name})`], {
                name: sql<string>`initcap(${documentTag.name})`,
            })
            .from(documentTag)
            .orderBy(sql`lower(${documentTag.name})`);

        return tags.map((t) => t.name);
    },
};
