import { useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import ImageContainer from "../components/ImageContainer";
import styles from "../styles/Home.module.css";

export default function Home() {
	const [darkMode, setDarkMode] = useState(true);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	return (
		<div className={`${styles.page} ${darkMode ? styles.darkMode : ""}`}>
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
                
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Anime Image Board</h1>
				<p className={styles.description}>
					Browse waifu images from various categories
				</p>
				<ImageContainer
					darkMode={darkMode}
					toggleDarkMode={toggleDarkMode}
				/>
				<Script
                    async
                    type="application/javascript"
                    src="https://a.magsrv.com/ad-provider.js"
                    strategy="afterInteractive"
                />
                <div
                    dangerouslySetInnerHTML={{
                        __html: `
                            <ins class="eas6a97888e2" data-zoneid="5806300"></ins>
                            <script>(AdProvider = window.AdProvider || []).push({"serve": {}});</script>
                        `,
                    }}
                />
			</main>
		</div>
	);
}
