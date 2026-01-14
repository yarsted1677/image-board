import { useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import ImageContainer from "../components/ImageContainer";
import ContentCheck from "../components/ContentCheck";
import styles from "../styles/Home.module.css";


export default function Home({ jsonLdData, initialImages }) {
	const [darkMode, setDarkMode] = useState(true);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	return (
		<div className={`${styles.page} ${darkMode ? styles.darkMode : ""}`}>
			<ContentCheck />
			<Head>
				<title>Anime Image Board</title>
				<meta
					name="description"
					content="Browse anime images from Waifu.pics API. Best nekko waifu images and anime artwork."
				/>
				<meta name="google-site-verification" content="bVP-jy034Vc_iLAOUtk93hs9h2GpnJG-0cMjHh3AtmU" />
				<link rel="icon" href="/favicon.ico" />

                <meta name="keywords" content="anime, waifu, anime images, anime gallery, waifu pics, anime artwork" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="author" content="TopWaifu" />

				<meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Anime Image Board" />
                <meta name="twitter:description" content="Browse anime images from Waifu.pics API" />

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
				<h1 className={styles.title}>Anime Image Board</h1>
				<p className={styles.description}>
					Browse waifu images from various categories
				</p>
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
        const response = await fetch("https://api.waifu.pics/many/sfw/neko", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 30 }),
        });
        const data = await response.json();
        initialImages = data.files || [];
    } catch (error) {
        console.error("Error pre-fetching images:", error);
    }

    const jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": "Anime Image Board",
                "url": "https://image-board-indol.vercel.app",
                "description": "Browse anime images from Waifu.pics API. Best nekko waifu images and anime artwork.",
                "image": "https://image-board-indol.vercel.app/og-image.png",
                "author": {
                    "@type": "Organization",
                    "name": "TopWaifu"
                },
                "mainEntity": {
                    "@type": "ImageGallery",
                    "name": "Anime Image Gallery",
                    "description": "A collection of curated anime and waifu images.",
                    "associatedMedia": initialImages.map(url => ({
                        "@type": "ImageObject",
                        "contentUrl": url,
                        "url": url,
                        "name": "Anime Character Image",
                        "description": "Anime character artwork from waifu.pics",
                        "thumbnailUrl": url
                    }))
                }
            },
            {
                "@type": "ItemList",
                "itemListElement": initialImages.map((url, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": url,
                    "name": `Anime Image ${index + 1}`
                }))
            }
        ]
    };

    return {
        props: {
            jsonLdData,
            initialImages
        },
        revalidate: 3600 // Re-generate page every hour
    };
}
