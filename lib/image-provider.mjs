import { isValidCategory, isAvailableCategory, unavailableMessage } from "./image-categories.mjs";

export const IMAGES_PER_REQUEST = 20;

export class ImageProviderError extends Error {
    constructor(message, status = 502) {
        super(message);
        this.status = status;
    }
}

// Shared by static generation and the server API; providers are never called by the browser.
export async function getImages({ type = "sfw", category = "neko", page = 0, signal } = {}) {
    if (!isValidCategory(type, category) || !Number.isInteger(page) || page < 0 || page > 1000) {
        throw new ImageProviderError("Invalid image category or page.", 400);
    }
    if (!isAvailableCategory(type, category)) {
        throw new ImageProviderError(unavailableMessage(type), 503);
    }

    let url;
    let extract;
    if (category === "shinobu" || category === "megumin") {
        const tag = category === "shinobu" ? "oshino_shinobu" : "megumin";
        const query = new URLSearchParams({
            page: "dapi", s: "post", q: "index", json: "1",
            tags: `${tag} rating:general`, limit: String(IMAGES_PER_REQUEST), pid: String(page)
        });
        url = `https://safebooru.org/index.php?${query}`;
        extract = data => Array.isArray(data)
            ? data.filter(item => ["general", "safe", "s", "g"].includes(item.rating))
                .map(item => item.file_url)
            : null;
    } else if (category === "lick") {
        // This endpoint returns one random GIF per call, not a batch.
        url = "https://api.otakugifs.xyz/gif?reaction=lick";
        extract = data => typeof data?.url === "string" ? [data.url] : null;
    } else {
        url = `https://nekos.best/api/v2/${category}?amount=${IMAGES_PER_REQUEST}`;
        extract = data => Array.isArray(data?.results) ? data.results.map(item => item.url) : null;
    }

    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "ImageBoard/1.0 (https://github.com/yarsted1677/image-board)" },
            signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000)
        });
        if (!response.ok) throw new Error(`Provider returned HTTP ${response.status}`);
        const files = extract(await response.json());
        if (!files) throw new Error("Unexpected provider response");
        return [...new Set(files.filter(file => typeof file === "string" && /^https:\/\//.test(file)))];
    } catch (error) {
        console.error(`Image provider failed for ${category}:`, error.message);
        throw new ImageProviderError("Images could not be loaded. Please try again.");
    }
}
