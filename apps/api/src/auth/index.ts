import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";

const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: (process.env.CORS_ORIGIN || "http://localhost:5174")
        .split(",")
        .map((o) => o.trim()),
    advanced: {
        // Cross-domain cookies for Vercel (frontend ≠ backend domain)
        crossSubDomainCookies: {
            enabled: isProduction,
        },
        defaultCookieAttributes: {
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
        },
    },
});
