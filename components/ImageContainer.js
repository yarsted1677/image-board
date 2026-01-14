import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/ImageContainer.module.css";

const SFW_TAGS = [
    "waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo","kiss",
    "lick","pat","smug","bonk","yeet","blush","smile","wave","highfive","handhold",
    "nom","bite","glomp","slap","kill","kick","happy","wink","poke","dance","cringe"
];

const NSFW_TAGS = ["waifu", "neko", "trap", "blowjob"];

const ImageContainer = ({ darkMode, toggleDarkMode, initialImages = [] }) => {
    const [apiType, setApiType] = useState("sfw"); // "sfw" or "nsfw"
    const [apiCategory, setApiCategory] = useState("neko"); // Default category
    const [images, setImages] = useState(initialImages);
    const [fetchedImagesSet, setFetchedImagesSet] = useState(new Set(initialImages));
    const [loading, setLoading] = useState(false);
    const IMAGES_PER_REQUEST = 30;
    
    // Ref to track if it's the first render
    const isFirstRun = useRef(true);

    // Fetch images from the waifu.pics API
    async function fetchMoreImages() {
        try {
            setLoading(true);
            const response = await fetch(
                `https://api.waifu.pics/many/${apiType}/${apiCategory}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: IMAGES_PER_REQUEST,
                    }),
                }
            );
            const data = await response.json();

            if (!data || !data.files) return;

            // Filter out duplicates
            const newImages = data.files.filter(
                (url) => !fetchedImagesSet.has(url)
            );

            // Update the set of known images
            const updatedFetchedSet = new Set(fetchedImagesSet);
            newImages.forEach((img) => updatedFetchedSet.add(img));
            setFetchedImagesSet(updatedFetchedSet);

            // Append new (non-duplicate) images
            setImages((prev) => [...prev, ...newImages]);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    }

    // Clear images when switching type or category
    useEffect(() => {
        // If it's the first run and we have initial images, skip the fetch
        // ASSUMPTION: initialImages corresponds to sfw/neko (the defaults)
        if (isFirstRun.current) {
            isFirstRun.current = false;
            if (initialImages.length > 0) {
                return;
            }
        }
        
        setImages([]);
        setFetchedImagesSet(new Set());
        fetchMoreImages();
    }, [apiType, apiCategory]);

    return (
        <div className={`${styles.mainContainer} ${darkMode ? styles.darkMode : ''}`}>
            <div className={styles.controls}>
                <div className={styles.filterGroup}>
                    <label htmlFor="type-select">Type: </label>
                    <select
                        id="type-select"
                        value={apiType}
                        onChange={(e) => setApiType(e.target.value)}
                        className={styles.select}
                    >
                        <option value="sfw">SFW</option>
                        <option value="nsfw">NSFW</option>
                    </select>
                </div>
                
                <div className={styles.filterGroup}>
                    <label htmlFor="tag-select">Tag: </label>
                    <select
                        id="tag-select"
                        value={apiCategory}
                        onChange={(e) => setApiCategory(e.target.value)}
                        className={styles.select}
                    >
                        {(apiType === "sfw" ? SFW_TAGS : NSFW_TAGS).map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button 
                    onClick={toggleDarkMode} 
                    className={styles.darkModeToggle}
                >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>
            
            {images.length === 0 && loading && (
                <div className={styles.loading}>Loading images...</div>
            )}
            
            <div className={styles.container}>
                {images.map((src, index) => (
                    <div key={index} className={styles.imageCard}>
                        <img 
                            src={src} 
                            alt={`${apiCategory} ${index}`} 
                            onClick={() => window.open(src, "_blank")}
                        />
                    </div>
                ))}
            </div>
            
            <div className={styles.loadMoreContainer}>
                <button 
                    onClick={fetchMoreImages} 
                    className={styles.loadMoreButton}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Load More Images"}
                </button>
            </div>
        </div>
    );
};

export default ImageContainer;