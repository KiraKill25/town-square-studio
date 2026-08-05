import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { HOWTO } from "@/lib/howto";
import { useI18n } from "@/lib/i18n";

const VIDEO_URL = "/media/game-master.mp4";


export function NarratorCard({
  title = "Le Meneur du Jeu",
  text,
  children,
}: {
  title?: string;
  text: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const { lang } = useI18n();
  const [guide, setGuide] = useState(false);
  const guideLabel = HOWTO[lang].openLabel;


  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.play().catch(() => {
      // Autoplay non muté bloqué → repli muet, puis son au 1er clic
      el.muted = true;
      el.play().catch(() => {
        el.pause();
        el.currentTime = 0;
      });
    });
  }, []);

  const replay = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = false;
    el.currentTime = 0;
    void el.play().catch(() => {});
  };

  return (
    <div className="surface-card animate-rise-in neon-ring overflow-hidden rounded-3xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <video
          ref={ref}
          src={VIDEO_URL}
          aria-label="Le meneur du jeu, conteur masqué au grimoire lumineux"
          autoPlay
          playsInline
          preload="auto"
          onClick={replay}
          className="h-full w-full cursor-pointer object-cover object-top"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
        <p className="pointer-events-none absolute bottom-3 left-4 text-xs font-bold tracking-[0.3em] text-primary uppercase">
          {title}
        </p>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-base leading-relaxed">{text}</p>
        {children}
      </div>
    </div>
  );
}
