import "dotenv/config";
import { auth } from "../auth/index.js";

async function createAdmin() {
    console.log("🔑 Creating admin account...");

    try {
        const result = await auth.api.signUpEmail({
            body: {
                name: "admin",
                email: "admin@admin.com",
                password: "admin123",
            },
        });

        console.log("✅ Admin account created successfully!");
        console.log("   Name:     admin");
        console.log("   Email:    admin@admin.com");
        console.log("   Password: admin123");
    } catch (error: any) {
        if (error?.message?.includes("already") || error?.body?.message?.includes("already")) {
            console.log("ℹ️  Admin account already exists.");
        } else {
            console.error("❌ Failed to create admin:", error?.message || error);
        }
    }

    process.exit(0);
}

createAdmin();
