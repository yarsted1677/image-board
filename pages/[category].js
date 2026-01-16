import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import ImageContainer from "../components/ImageContainer";
import ContentCheck from "../components/ContentCheck";
import styles from "../styles/Home.module.css";

const SFW_TAGS = [
    "waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo","kiss",
    "lick","pat","smug","bonk","yeet","blush","smile","wave","highfive","handhold",
    "nom","bite","glomp","slap","kill","kick","happy","wink","poke","dance","cringe"
];

const NSFW_TAGS = ["waifu", "neko", "trap", "blowjob"];

export default function CategoryPage({ jsonLdData, initialImages, category, apiType }) {
    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    const pageTitle = `${categoryTitle} Anime Images - Waifu Gallery`;
    const pageDescription = `Browse ${categoryTitle} anime images and waifu artwork. Free ${categoryTitle} anime gallery with high-quality images.`;

    return (
        <div className={`${styles.page} ${darkMode ? styles.darkMode : ""}`}>
            <ContentCheck />
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="google-site-verification" content="bVP-jy034Vc_iLAOUtk93hs9h2GpnJG-0cMjHh3AtmU" />
                <link rel="icon" href="/favicon.ico" />

                <meta name="keywords" content={`${category}, anime, waifu, anime images, ${category} anime, ${category} waifu, anime gallery`} />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="author" content="TopWaifu" />

                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://image-board-indol.vercel.app/${category}`} />
                <meta property="og:image" content="https://image-board-indol.vercel.app/og-image.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />

                <link rel="canonical" href={`https://image-board-indol.vercel.app/${category}`} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
                />
            </Head>
            
            <Script
                type="text/javascript"
                src="https://pl28306369.effectivegatecpm.com/4e/52/d0/4e52d0d6e7320408e43d59b629e39f0e.js"
                strategy="afterInteractive"
            />

            <main className={styles.main}>
                <Script
                    id="atoptions-setup"
                    type="text/javascript"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            atOptions = {
                                'key' : 'e751446441ee5b86993b7aaf0c991b61',
                                'format' : 'iframe',
                                'height' : 60,
                                'width' : 468,
                                'params' : {}
                            };
                        `,
                    }}
                />
                <Script
                    id="atoptions-script"
                    type="text/javascript"
                    src="https://www.highperformanceformat.com/e751446441ee5b86993b7aaf0c991b61/invoke.js"
                    strategy="afterInteractive"
                />
                
                <h1 className={styles.title}>{categoryTitle} Anime Images</h1>
                <p className={styles.description}>
                    Browse {categoryTitle} waifu images from our curated collection
                </p>
                
                <ImageContainer
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    initialImages={initialImages}
                    defaultCategory={category}
                    defaultApiType={apiType}
                />
                
                <Script
                    type="text/javascript"
                    src="https://pl28306509.effectivegatecpm.com/c0/2e/ee/c02eeee6cfc41e9ec80e4e8832981771.js"
                />
            </main>
        </div>
    );
}

export async function getStaticPaths() {
    const allCategories = [...SFW_TAGS, ...NSFW_TAGS];
    
    const paths = allCategories.map(category => ({
        params: { category }
    }));

    return {
        paths,
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    const { category } = params;
    const apiType = SFW_TAGS.includes(category) ? "sfw" : "nsfw";
    
    let initialImages = [];
    try {
        const response = await fetch(`https://api.waifu.pics/many/${apiType}/${category}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 30 }),
        });
        const data = await response.json();
        initialImages = data.files || [];
    } catch (error) {
        console.error("Error pre-fetching images:", error);
    }

    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    
    const jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": `${categoryTitle} Anime Image Board`,
                "url": `https://image-board-indol.vercel.app/${category}`,
                "description": `Browse ${categoryTitle} anime images and waifu artwork. Free ${categoryTitle} anime gallery.`,
                "image": "https://image-board-indol.vercel.app/og-image.png",
                "author": {
                    "@type": "Organization",
                    "name": "TopWaifu"
                },
                "mainEntity": {
                    "@type": "ImageGallery",
                    "name": `${categoryTitle} Anime Gallery`,
                    "description": `A collection of curated ${categoryTitle} anime and waifu images.`,
                    "associatedMedia": initialImages.map(url => ({
                        "@type": "ImageObject",
                        "contentUrl": url,
                        "url": url,
                        "name": `${categoryTitle} Anime Image`,
                        "description": `${categoryTitle} anime character artwork`,
                        "thumbnailUrl": url
                    }))
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://image-board-indol.vercel.app"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": categoryTitle,
                        "item": `https://image-board-indol.vercel.app/${category}`
                    }
                ]
            },
            {
                "@type": "WebSite",
                "name": "Anime Image Board",
                "url": "https://image-board-indol.vercel.app"
            }
        ]
    };

    return {
        props: {
            jsonLdData,
            initialImages,
            category,
            apiType
        },
        revalidate: 3600
    };
}