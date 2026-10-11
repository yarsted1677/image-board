import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/ImageContainer.module.css";
import { SFW_TAGS, NSFW_TAGS, isAvailableCategory, unavailableMessage } from "../lib/image-categories.mjs";

const ImageContainer = ({ darkMode, toggleDarkMode, initialImages = [], defaultCategory = "neko", defaultApiType = "sfw" }) => {
    const [apiType, setApiType] = useState(defaultApiType);
    const [apiCategory, setApiCategory] = useState(defaultCategory);
    const [images, setImages] = useState(initialImages);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const knownImages = useRef(new Set(initialImages));
    const page = useRef(initialImages.length > 0 ? 1 : 0);
    const activeRequest = useRef(null);
    const isFirstRun = useRef(true);
    const available = isAvailableCategory(apiType, apiCategory);

    async function fetchMoreImages() {
        if (!available || activeRequest.current) return;
        const controller = new AbortController();
        activeRequest.current = controller;
        setLoading(true);
        setError("");
        setNotice("");
        try {
            const query = new URLSearchParams({ type: apiType, category: apiCategory, page: String(page.current) });
            const response = await fetch(`/api/images?${query}`, { signal: controller.signal });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Images could not be loaded. Please try again.");
            if (!Array.isArray(data.files)) throw new Error("Unexpected image response. Please try again.");
            if (controller.signal.aborted) return;
            const newImages = data.files.filter(url => {
                if (knownImages.current.has(url)) return false;
                knownImages.current.add(url);
                return true;
            });
            page.current += 1;
            setImages(previous => [...previous, ...newImages]);
            if (newImages.length === 0) setNotice("No new images found. Try again or select another tag.");
        } catch (error) {
            if (!controller.signal.aborted) setError(error.message);
        } finally {
            if (activeRequest.current === controller) {
                activeRequest.current = null;
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            if (initialImages.length > 0) return () => activeRequest.current?.abort();
        }
        activeRequest.current?.abort();
        activeRequest.current = null;
        knownImages.current = new Set();
        page.current = 0;
        setImages([]);
        setError("");
        setNotice("");
        setLoading(false);
        fetchMoreImages();
        return () => activeRequest.current?.abort();
    }, [apiType, apiCategory]);

    function changeType(type) {
        setApiType(type);
        if (!isAvailableCategory(type, apiCategory)) setApiCategory("neko");
    }

    return (
        <div className={`${styles.mainContainer} ${darkMode ? styles.darkMode : ''}`}>
            <div className={styles.controls}>
                <div className={styles.filterGroup}>
                    <label htmlFor="type-select">Type: </label>
                    <select id="type-select" value={apiType} onChange={e => changeType(e.target.value)} className={styles.select}>
                        <option value="sfw">SFW</option>
                        <option value="nsfw" disabled>NSFW (temporarily unavailable)</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="tag-select">Tag: </label>
                    <select id="tag-select" value={apiCategory} onChange={e => setApiCategory(e.target.value)} className={styles.select}>
                        {(apiType === "sfw" ? SFW_TAGS : NSFW_TAGS).map(tag => (
                            <option key={tag} value={tag} disabled={!isAvailableCategory(apiType, tag)}>
                                {tag}{!isAvailableCategory(apiType, tag) ? " (temporarily unavailable)" : ""}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={toggleDarkMode} className={styles.darkModeToggle}>
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>
            {!available && <p className={styles.loading} role="status">{unavailableMessage(apiType)}</p>}
            {error && <p className={styles.loading} role="alert">{error}</p>}
            {notice && <p className={styles.loading} role="status">{notice}</p>}
            {images.length === 0 && loading && <div className={styles.loading}>Loading images...</div>}
            <div className={styles.container}>
                {images.map((src, index) => (
                    <div key={src} className={styles.imageCard}>
                        <img src={src} alt={`${apiCategory} ${index}`} loading="lazy"
                            onClick={() => window.open(src, "_blank", "noopener,noreferrer")} />
                    </div>
                ))}
            </div>
            <div className={styles.loadMoreContainer}>
                <button onClick={fetchMoreImages} className={styles.loadMoreButton} disabled={loading || !available}>
                    {loading ? "Loading..." : "Load More Images"}
                </button>
            </div>
        </div>
    );
};

export default ImageContainer;
