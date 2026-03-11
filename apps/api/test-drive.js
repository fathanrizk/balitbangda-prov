import fs from 'node:fs';

async function testDriveFetch() {
    const fileId = "a6258ec0-5e04-48b2-9339-60287ae49c22"; // We used this ID earlier
    // wait, the ID from the database was the database ID "a6258...".
    // I need the actual Google Drive fileId!

    // Let's first fetch the doc from the DB via API to get the real Google Drive URL.
    const res = await fetch("http://localhost:3001/api/documents/a6258ec0-5e04-48b2-9339-60287ae49c22");
    const doc = await res.json();
    console.log("PDF URL:", doc.pdfUrl);

    let driveFileId = null;
    const fileMatch = doc.pdfUrl.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
    if (fileMatch) {
        driveFileId = fileMatch[1];
    }
    if (!driveFileId) {
        const idMatch = doc.pdfUrl.match(/drive\.google\.com\/(?:open|uc)\?.*id=([^&#]+)/);
        if (idMatch) {
            driveFileId = idMatch[1];
        }
    }
    console.log("Extracted Google Drive File ID:", driveFileId);

    if (!driveFileId) return;

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveFileId}`;
    console.log("Fetching from:", downloadUrl);

    const response = await fetch(downloadUrl, { redirect: "follow" });
    console.log("Status:", response.status);
    console.log("Content-Type:", response.headers.get("content-type"));

    const text = await response.text();
    console.log("Response text snippet (first 500 chars):");
    console.log(text.substring(0, 500));

    const confirmMatch = text.match(/confirm=([0-9A-Za-z_-]+)/);
    console.log("Confirm match:", confirmMatch ? confirmMatch[1] : "NOT FOUND");
}

testDriveFetch().catch(console.error);
