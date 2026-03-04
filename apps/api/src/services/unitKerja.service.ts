import { db } from "../db/index.js";
import { unitKerja, document } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

interface CreateUnitKerjaInput {
    name: string;
    code: string;
    headName?: string;
}

export const unitKerjaService = {
    async list() {
        const units = await db
            .select({
                id: unitKerja.id,
                name: unitKerja.name,
                code: unitKerja.code,
                headName: unitKerja.headName,
                isActive: unitKerja.isActive,
                createdAt: unitKerja.createdAt,
                documentCount: sql<number>`cast(count(${document.id}) as integer)`,
            })
            .from(unitKerja)
            .leftJoin(document, eq(document.unitKerjaId, unitKerja.id))
            .groupBy(unitKerja.id, unitKerja.name, unitKerja.code, unitKerja.headName, unitKerja.isActive, unitKerja.createdAt)
            .orderBy(unitKerja.name);

        return units;
    },

    async getById(id: string) {
        const [unit] = await db
            .select()
            .from(unitKerja)
            .where(eq(unitKerja.id, id));

        return unit || null;
    },

    async create(input: CreateUnitKerjaInput) {
        const [unit] = await db
            .insert(unitKerja)
            .values({
                name: input.name,
                code: input.code,
                headName: input.headName,
            })
            .returning();

        return unit;
    },

    async update(id: string, input: Partial<CreateUnitKerjaInput & { isActive: boolean }>) {
        const [unit] = await db
            .update(unitKerja)
            .set({
                ...(input.name && { name: input.name }),
                ...(input.code && { code: input.code }),
                ...(input.headName !== undefined && { headName: input.headName }),
                ...(input.isActive !== undefined && { isActive: input.isActive }),
                updatedAt: new Date(),
            })
            .where(eq(unitKerja.id, id))
            .returning();

        return unit || null;
    },

    async delete(id: string) {
        // Check if unit has documents
        const docs = await db
            .select({ count: sql<number>`count(*)` })
            .from(document)
            .where(eq(document.unitKerjaId, id));

        if (Number(docs[0].count) > 0) {
            throw new Error("Cannot delete unit kerja with existing documents");
        }

        const [unit] = await db
            .delete(unitKerja)
            .where(eq(unitKerja.id, id))
            .returning();

        return unit || null;
    },
};
