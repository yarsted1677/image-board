const SITE_URL = 'https://image-board-indol.vercel.app';

const SFW_TAGS = [
    "waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo","kiss",
    "lick","pat","smug","bonk","yeet","blush","smile","wave","highfive","handhold",
    "nom","bite","glomp","slap","kill","kick","happy","wink","poke","dance","cringe"
];

const NSFW_TAGS = ["trap", "blowjob"];

function generateSiteMap() {
    const allCategories = [...new Set([...SFW_TAGS, ...NSFW_TAGS])];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    xml += '<url>\n<loc>' + SITE_URL + '</loc>\n<lastmod>' + new Date().toISOString() + '</lastmod>\n<changefreq>daily</changefreq>\n<priority>1.0</priority>\n</url>\n';
    
    allCategories.forEach((category) => {
        xml += '<url>\n<loc>' + SITE_URL + '/' + category + '</loc>\n<lastmod>' + new Date().toISOString() + '</lastmod>\n<changefreq>daily</changefreq>\n<priority>0.8</priority>\n</url>\n';
    });
    
    xml += '</urlset>';
    return xml;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
    const sitemap = generateSiteMap();

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;