/**
 * Convert various Google Drive share URLs into a direct-embeddable image URL.
 * 
 * Google Drive's /uc?export=view URL gets blocked by modern browsers (ORB policy).
 * Instead, we use the lh3.googleusercontent.com thumbnail endpoint which works
 * reliably for embedding in <img> tags.
 * 
 * Supports formats:
 *   - https://drive.google.com/file/d/FILE_ID/view?usp=...
 *   - https://drive.google.com/open?id=FILE_ID
 *   - https://drive.google.com/uc?id=FILE_ID&...
 * 
 * If the URL is not a Google Drive link, return it as-is.
 */
export function toDirectImageUrl(url) {
    if (!url) return url;

    let fileId = null;

    // Format: /file/d/FILE_ID/...
    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
    if (fileMatch) {
        fileId = fileMatch[1];
    }

    // Format: /open?id=FILE_ID or /uc?id=FILE_ID
    if (!fileId) {
        const idMatch = url.match(/drive\.google\.com\/(?:open|uc)\?.*id=([^&#]+)/);
        if (idMatch) {
            fileId = idMatch[1];
        }
    }

    if (fileId) {
        // Use lh3.googleusercontent.com — this bypasses ORB/CORS blocking
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    // Not a Google Drive link — return as-is
    return url;
}
