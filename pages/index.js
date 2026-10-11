import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import ImageContainer from "../components/ImageContainer";
import ContentCheck from "../components/ContentCheck";
import styles from "../styles/Home.module.css";
import { AVAILABLE_SFW_TAGS } from "../lib/image-categories.mjs";
import { getImages } from "../lib/image-provider.mjs";


export default function Home({ jsonLdData, initialImages }) {
    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`${styles.page} ${darkMode ? styles.darkMode : ""}`}>
            <ContentCheck />
            <Head>
                <title>Anime Image Board - Free Waifu Gallery & Anime Art Collection</title>
                <meta
                    name="description"
                    content="Browse anime images and GIFs across multiple categories. Discover neko, waifu, shinobu and more anime artwork."
                />
                <meta name="google-site-verification" content="bVP-jy034Vc_iLAOUtk93hs9h2GpnJG-0cMjHh3AtmU" />
                <link rel="icon" href="/favicon.ico" />

                <meta name="keywords" content="anime image board, anime gallery, waifu collection, anime art, multiple anime categories, anime image site" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="author" content="TopWaifu" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Anime Image Board - Free Waifu Gallery & Anime Art Collection" />
                <meta name="twitter:description" content="Browse anime images and GIFs across multiple categories. Discover neko, waifu, shinobu and more anime artwork." />

                <meta property="og:title" content="Anime Image Board - Free Waifu Gallery & Anime Art Collection" />
                <meta property="og:description" content="Browse anime images and GIFs across multiple categories. Discover neko, waifu, shinobu and more anime artwork." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://image-board-indol.vercel.app" />
                <meta property="og:image" content="https://image-board-indol.vercel.app/og-image.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                <link rel="canonical" href="https://image-board-indol.vercel.app" />
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
                <h1 className={styles.title}>Ultimate Anime Image Board</h1>
                <p className={styles.description}>
                    Explore anime images and GIFs. Browse neko, shinobu, megumin and more!
                </p>

                <h2 className={styles.categoryTitle}>Popular Categories:</h2>
                <div className={styles.categoryLinks}>
                    {AVAILABLE_SFW_TAGS.map(tag => (
                        <a key={tag} href={`/${tag}`} title={`Browse ${tag} Anime Images`}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </a>
                    ))}
                </div>

                <ImageContainer
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    initialImages={initialImages}
                />

                <Script
                    type="text/javascript"
                    src="https://pl28306509.effectivegatecpm.com/c0/2e/ee/c02eeee6cfc41e9ec80e4e8832981771.js"
                />
            </main>
        </div>
    );
}

export async function getStaticProps() {
    let initialImages = [];
    try {
        initialImages = await getImages();
    } catch (error) {
        console.error("Error pre-fetching images:", error);
    }

    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Anime Image Board",
        "alternateName": "TopWaifu Gallery",
        "url": "https://image-board-indol.vercel.app",
        "description": "Anime images and GIFs across multiple categories including neko, waifu, shinobu and more.",
        "author": {
            "@type": "Organization",
            "name": "TopWaifu"
        },
        "mainEntity": {
            "@type": "ItemList",
            "name": "Anime Categories",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Neko Anime Images",
                    "url": "https://image-board-indol.vercel.app/neko"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Waifu Images",
                    "url": "https://image-board-indol.vercel.app/waifu"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Shinobu Images",
                    "url": "https://image-board-indol.vercel.app/shinobu"
                }
            ]
        }
    };

    return {
        props: {
            jsonLdData,
            initialImages
        },
        revalidate: 3600 // Re-generate page every hour
    };
}
