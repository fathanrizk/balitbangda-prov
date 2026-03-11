import { db } from "../db/index.js";
import { document, documentTag, documentAuthor, unitKerja } from "../db/schema.js";
import { eq, ilike, sql, and, desc, asc, inArray } from "drizzle-orm";

interface CreateDocumentInput {
    title: string;
    summary?: string;
    year: number;
    coverUrl?: string;
    pdfUrl?: string;
    unitKerjaId?: string;
    uploadedBy?: string;
    tags?: string[];
    authors?: { name: string; avatarUrl?: string }[];
}

interface ListDocumentsQuery {
    page?: number;
    limit?: number;
    search?: string;
    unitKerjaId?: string;
    year?: number;
    tag?: string;
    sort?: "newest" | "oldest";
}

export const documentService = {
    async list(query: ListDocumentsQuery) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        const conditions = [];

        if (query.search) {
            conditions.push(ilike(document.title, `%${query.search}%`));
        }
        if (query.unitKerjaId) {
            conditions.push(eq(document.unitKerjaId, query.unitKerjaId));
        }
        if (query.year) {
            conditions.push(eq(document.year, query.year));
        }
        if (query.tag) {
            const docIdsWithTagQuery = db
                .select({ id: documentTag.documentId })
                .from(documentTag)
                .where(ilike(documentTag.name, query.tag));
            conditions.push(inArray(document.id, docIdsWithTagQuery));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Utama: Urutkan berdasarkan Tahun terbit
        const orderByYear = query.sort === "oldest" ? asc(document.year) : desc(document.year);
        // Sekunder: Jika tahunnya sama, urutkan berdasarkan waktu upload
        const orderByCreatedAt = query.sort === "oldest" ? asc(document.createdAt) : desc(document.createdAt);

        // Get documents
        let docsQuery = db
            .select({
                id: document.id,
                title: document.title,
                summary: document.summary,
                year: document.year,
                coverUrl: document.coverUrl,
                pdfUrl: document.pdfUrl,
                unitKerjaId: document.unitKerjaId,
                unitKerjaName: unitKerja.name,
                viewCount: document.viewCount,
                downloadCount: document.downloadCount,
                createdAt: document.createdAt,
            })
            .from(document)
            .leftJoin(unitKerja, eq(document.unitKerjaId, unitKerja.id))
            .where(whereClause)
            .orderBy(orderByYear, orderByCreatedAt)
            .limit(limit)
            .offset(offset);

        const docs = await docsQuery;

        // Get tags for each document
        const docIds = docs.map((d) => d.id);
        const tags =
            docIds.length > 0
                ? await db
                    .select()
                    .from(documentTag)
                    .where(inArray(documentTag.documentId, docIds))
                : [];

        // Get total count
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(document)
            .where(whereClause);

        const total = Number(countResult[0].count);

        // Map tags to documents
        const docsWithTags = docs.map((doc) => ({
            ...doc,
            tags: tags.filter((t) => t.documentId === doc.id).map((t) => t.name),
        }));

        return {
            data: docsWithTags,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async getById(id: string) {
        const [doc] = await db
            .select({
                id: document.id,
                title: document.title,
                summary: document.summary,
                year: document.year,
                coverUrl: document.coverUrl,
                pdfUrl: document.pdfUrl,
                unitKerjaId: document.unitKerjaId,
                unitKerjaName: unitKerja.name,
                viewCount: document.viewCount,
                downloadCount: document.downloadCount,
                uploadedBy: document.uploadedBy,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt,
            })
            .from(document)
            .leftJoin(unitKerja, eq(document.unitKerjaId, unitKerja.id))
            .where(eq(document.id, id));

        if (!doc) return null;

        const tags = await db
            .select()
            .from(documentTag)
            .where(eq(documentTag.documentId, id));

        const authors = await db
            .select()
            .from(documentAuthor)
            .where(eq(documentAuthor.documentId, id))
            .orderBy(asc(documentAuthor.order));

        return {
            ...doc,
            tags: tags.map((t) => t.name),
            authors: authors.map((a) => ({
                id: a.id,
                name: a.name,
                avatarUrl: a.avatarUrl,
            })),
        };
    },

    async create(input: CreateDocumentInput) {
        const [doc] = await db
            .insert(document)
            .values({
                title: input.title,
                summary: input.summary,
                year: input.year,
                coverUrl: input.coverUrl,
                pdfUrl: input.pdfUrl,
                unitKerjaId: input.unitKerjaId,
                uploadedBy: input.uploadedBy,
            })
            .returning();

        // Insert tags
        if (input.tags && input.tags.length > 0) {
            await db.insert(documentTag).values(
                input.tags.map((name) => ({
                    documentId: doc.id,
                    name,
                }))
            );
        }

        // Insert authors
        if (input.authors && input.authors.length > 0) {
            await db.insert(documentAuthor).values(
                input.authors.map((author, index) => ({
                    documentId: doc.id,
                    name: author.name,
                    avatarUrl: author.avatarUrl,
                    order: index,
                }))
            );
        }

        return doc;
    },

    async update(id: string, input: Partial<CreateDocumentInput>) {
        const [doc] = await db
            .update(document)
            .set({
                ...(input.title && { title: input.title }),
                ...(input.summary !== undefined && { summary: input.summary }),
                ...(input.year && { year: input.year }),
                ...(input.coverUrl !== undefined && { coverUrl: input.coverUrl }),
                ...(input.pdfUrl !== undefined && { pdfUrl: input.pdfUrl }),
                ...(input.unitKerjaId && { unitKerjaId: input.unitKerjaId }),
                updatedAt: new Date(),
            })
            .where(eq(document.id, id))
            .returning();

        if (!doc) return null;

        // Replace tags if provided
        if (input.tags) {
            await db.delete(documentTag).where(eq(documentTag.documentId, id));
            if (input.tags.length > 0) {
                await db.insert(documentTag).values(
                    input.tags.map((name) => ({
                        documentId: id,
                        name,
                    }))
                );
            }
        }

        // Replace authors if provided
        if (input.authors) {
            await db.delete(documentAuthor).where(eq(documentAuthor.documentId, id));
            if (input.authors.length > 0) {
                await db.insert(documentAuthor).values(
                    input.authors.map((author, index) => ({
                        documentId: id,
                        name: author.name,
                        avatarUrl: author.avatarUrl,
                        order: index,
                    }))
                );
            }
        }

        return doc;
    },

    async delete(id: string) {
        const [doc] = await db
            .delete(document)
            .where(eq(document.id, id))
            .returning();
        return doc || null;
    },

    async incrementViews(id: string) {
        await db
            .update(document)
            .set({ viewCount: sql`${document.viewCount} + 1` })
            .where(eq(document.id, id));
    },

    async incrementDownloads(id: string) {
        await db
            .update(document)
            .set({ downloadCount: sql`${document.downloadCount} + 1` })
            .where(eq(document.id, id));
    },
};
