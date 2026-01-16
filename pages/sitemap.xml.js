const SITE_URL = 'https://image-board-indol.vercel.app';

const SFW_TAGS = [
    "waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo","kiss",
    "lick","pat","smug","bonk","yeet","blush","smile","wave","highfive","handhold",
    "nom","bite","glomp","slap","kill","kick","happy","wink","poke","dance","cringe"
];

const NSFW_TAGS = ["waifu", "neko", "trap", "blowjob"];

function generateSiteMap() {
    const allCategories = [...new Set([...SFW_TAGS, ...NSFW_TAGS])]; // Remove duplicates
    
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <!-- Homepage -->
        <url>
            <loc>${SITE_URL}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
        
        ${allCategories
            .map((category) => {
                return `
        <url>
            <loc>${SITE_URL}/${category}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>
                `;
            })
            .join('')}
    </urlset>
    `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    const sitemap = generateSiteMap();

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;