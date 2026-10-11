import { AVAILABLE_SFW_TAGS } from "../lib/image-categories.mjs";

const SITE_URL = 'https://image-board-indol.vercel.app';

function generateSiteMap() {
    const allCategories = AVAILABLE_SFW_TAGS;
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    xml += '<url>\n<loc>' + SITE_URL + '</loc>\n<lastmod>' + new Date().toISOString() + '</lastmod>\n<changefreq>daily</changefreq>\n<priority>1.0</priority>\n</url>\n';

    allCategories.forEach((category) => {
        // Lower priority for category pages vs homepage
        xml += '<url>\n<loc>' + SITE_URL + '/' + category + '</loc>\n<lastmod>' + new Date().toISOString() + '</lastmod>\n<changefreq>weekly</changefreq>\n<priority>0.6</priority>\n</url>\n';
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
