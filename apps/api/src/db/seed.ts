import "dotenv/config";
import { db } from "./index.js";
import { unitKerja, document, documentTag, documentAuthor } from "../db/schema.js";

async function seed() {
    console.log("🌱 Seeding database...");

    // Seed Unit Kerja
    const [unit1] = await db
        .insert(unitKerja)
        .values({
            name: "Bidang Penguatan Inovasi dan Kebijakan Strategis Daerah",
            code: "BIT-001",
            headName: "Dr. Ahmad Fauzi",
        })
        .returning();

    const [unit2] = await db
        .insert(unitKerja)
        .values({
            name: "Bidang Ekonomi Pembangunan dan Kerjasama",
            code: "BEP-002",
            headName: "Ir. Siti Aminah",
        })
        .returning();

    const [unit3] = await db
        .insert(unitKerja)
        .values({
            name: "Bidang Pemerintahan dan Sosial Budaya",
            code: "BSP-003",
            headName: "Budi Santoso, M.Si",
        })
        .returning();

    const [unit4] = await db
        .insert(unitKerja)
        .values({
            name: "Bidang Ilmu Pengetahuan dan Teknologi",
            code: "SEK-004",
            headName: "Hj. Ratna Sari",
        })
        .returning();

    /*    
    const [unit5] = await db
        .insert(unitKerja)
        .values({
            name: "Bida Laboratorium",
            code: "LAB-005",
            headName: "Hendrawan, Ph.D",
        })
        .returning();
    */

    // Seed Documents
    const docs = [
        { title: "Analisis Ekonomi Makro Lampung 2023", summary: "Analisis komprehensif ekonomi makro Provinsi Lampung tahun 2023.", year: 2023, unitKerjaId: unit2.id },
        { title: "Strategi Pengentasan Kemiskinan Terpadu", summary: "Evaluasi program pengentasan kemiskinan berbasis data.", year: 2022, unitKerjaId: unit3.id },
        { title: "Inovasi Teknologi Pertanian Berkelanjutan", summary: "Kajian inovasi teknologi untuk sektor pertanian berkelanjutan.", year: 2023, unitKerjaId: unit1.id },
        { title: "Masterplan Pariwisata Pesisir Barat", summary: "Masterplan pengembangan pariwisata di wilayah Pesisir Barat.", year: 2021, unitKerjaId: unit2.id },
        { title: "Kajian Dampak Sosial Ekonomi Infrastruktur", summary: "Kajian dampak sosial ekonomi pembangunan infrastruktur.", year: 2023, unitKerjaId: unit3.id },
        { title: "Pengembangan UMKM Berbasis Digital", summary: "Strategi pengembangan UMKM berbasis digitalisasi.", year: 2022, unitKerjaId: unit2.id },
    ];

    const seededDocs = [];
    for (const docData of docs) {
        const [doc] = await db.insert(document).values(docData).returning();
        seededDocs.push(doc);
    }

    // Seed Tags
    const tagData = [
        { documentId: seededDocs[0].id, name: "Ekonomi" },
        { documentId: seededDocs[1].id, name: "Sosial" },
        { documentId: seededDocs[2].id, name: "Pertanian" },
        { documentId: seededDocs[3].id, name: "Wisata" },
        { documentId: seededDocs[4].id, name: "Infrastruktur" },
        { documentId: seededDocs[5].id, name: "Ekonomi" },
        { documentId: seededDocs[5].id, name: "Digital" },
    ];

    await db.insert(documentTag).values(tagData);

    // Seed Authors
    const authorData = [
        { documentId: seededDocs[0].id, name: "Dr. Ahmad Hidayat", order: 0 },
        { documentId: seededDocs[0].id, name: "Siti Aminah, M.E.", order: 1 },
        { documentId: seededDocs[1].id, name: "Budi Santoso", order: 0 },
        { documentId: seededDocs[2].id, name: "Dr. Ahmad Fauzi", order: 0 },
    ];

    await db.insert(documentAuthor).values(authorData);

    console.log("✅ Seed complete!");
    console.log(`   - ${5} unit kerja`);
    console.log(`   - ${seededDocs.length} documents`);
    console.log(`   - ${tagData.length} tags`);
    console.log(`   - ${authorData.length} authors`);

    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
