import {
    pgTable,
    uuid,
    varchar,
    text,
    integer,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

// ==========================================
// Better Auth tables (auto-managed)
// ==========================================

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

// ==========================================
// Application tables
// ==========================================

export const unitKerja = pgTable("unit_kerja", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    headName: varchar("head_name", { length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const document = pgTable("document", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    summary: text("summary"),
    year: integer("year").notNull(),
    coverUrl: varchar("cover_url", { length: 500 }),
    pdfUrl: varchar("pdf_url", { length: 500 }),
    unitKerjaId: uuid("unit_kerja_id").references(() => unitKerja.id),
    viewCount: integer("view_count").default(0).notNull(),
    downloadCount: integer("download_count").default(0).notNull(),
    uploadedBy: text("uploaded_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentTag = pgTable("document_tag", {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
        .notNull()
        .references(() => document.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
});

export const documentAuthor = pgTable("document_author", {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
        .notNull()
        .references(() => document.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    order: integer("order").default(0).notNull(),
});
