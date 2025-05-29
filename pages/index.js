import { useState, useEffect } from "react";
import Head from "next/head";
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
					content="Browse anime images from Waifu.pics API"
				/>
				<link rel="icon" href="/favicon.ico" />
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
			</main>
		</div>
	);
}
