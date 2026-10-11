import { getImages, ImageProviderError } from "../../lib/image-provider.mjs";

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { type = "sfw", category = "neko", page = "0" } = req.query;
    if (typeof type !== "string" || typeof category !== "string" ||
        typeof page !== "string" || !/^\d+$/.test(page)) {
        return res.status(400).json({ error: "Invalid image request." });
    }

    try {
        const files = await getImages({ type, category, page: Number(page) });
        return res.status(200).json({ files });
    } catch (error) {
        const status = error instanceof ImageProviderError ? error.status : 500;
        return res.status(status).json({ error: status === 500 ? "Images could not be loaded." : error.message });
    }
}
