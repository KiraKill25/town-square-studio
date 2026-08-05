import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const VIDEO_URL = "./media/logo-video.mp4";

/**
 * Logo vidéo interactif : lecture unique avec son, gel sur la dernière image,
 * relance au clic. Anneau néon en dégradé radial avec pulsation continue.
 */
export function VideoLogo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    // Always start muted for webview autoplay compliance
    el.muted = true;
    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.warn("Autoplay muted fallback triggered:", e);
      });
    }
  }, []);

  const replay = () => {
    const el = ref.current;
    if (!el) return;
    try {
      el.muted = false;
      el.currentTime = 0;
      void el.play().catch(() => {});
    } catch (e) {
      console.warn("Replay trigger warning:", e);
    }
  };

  return (
    <div className="relative mt-4 size-52 sm:size-64">
      {/* Anneau néon : dégradé radial fondu vers l'extérieur + bloom multi-couches */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,42,133,0) 62%, rgba(255,42,133,0.95) 72%, rgba(255,42,133,0.45) 84%, rgba(255,42,133,0) 100%)",
          boxShadow:
            "0 0 20px rgba(255,42,133,0.8), 0 0 45px rgba(255,42,133,0.4), 0 0 70px rgba(255,42,133,0.1)",
        }}
        animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.03, 1] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      />
      <video
        ref={ref}
        src={VIDEO_URL}
        aria-label={label}
        muted
        playsInline
        preload="metadata"
        onClick={replay}
        className="relative block size-full cursor-pointer rounded-full object-cover"
      />
    </div>
  );
}
