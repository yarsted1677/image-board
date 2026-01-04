import { useState, useEffect } from 'react';
import styles from '../styles/ContentCheck.module.css';

const ContentCheck = () => {
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    const bait = document.createElement('div');
    bait.setAttribute('class', 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links');
    bait.setAttribute('style', 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;');
    document.body.appendChild(bait);

    const check = () => {
      const isBlocked = 
        window.document.body.getAttribute('abp') !== null ||
        bait.offsetParent === null ||
        bait.offsetHeight === 0 ||
        bait.offsetLeft === 0 ||
        bait.offsetTop === 0 ||
        bait.clientWidth === 0 ||
        bait.clientHeight === 0;

      if (isBlocked) {
        setIsDetected(true);
      } else {
        fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
            method: 'HEAD', 
            mode: 'no-cors',
            cache: 'no-store'
        }).catch(() => {
            setIsDetected(true);
        });
      }
      
      if (bait.parentNode) {
        bait.parentNode.removeChild(bait);
      }
    };

    const timer = setTimeout(check, 2300);

    return () => clearTimeout(timer);
  }, []);

  if (!isDetected) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <img src="/anime-girl.gif" alt="Support us" className={styles.gif} />
        <h2 className={styles.title}>Notice</h2>
        <p className={styles.message}>
          We noticed you are using a tool that might interfere with our site. 
          Our content is provided for free thanks to our sponsors. 
          Please consider supporting us by whitelisting our site.
        </p>
        <button className={styles.button} onClick={() => window.location.reload()}>
          I've updated my settings, Refresh
        </button>
      </div>
    </div>
  );
};

export default ContentCheck;
