import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiBehance, SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import { FaLinkedin, FaPlay, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const roles = ["Creative Designer", "Brand Developer", "Visual Storyteller"];

type ImageSlide = { type: "image"; src: string; alt: string };
type VideoFileSlide = { type: "video"; src: string; poster?: string };
type YouTubeSlide = { type: "youtube"; videoId: string; poster: string; label?: string };

type Slide = ImageSlide | VideoFileSlide | YouTubeSlide;

/* ── Customise your slides here ── */
const slides: Slide[] = [
  {
    type: "image",
    src: "/images/home-portfolio-tea-collage.jpg",
    alt: "Chandima Kosala tea packaging portfolio",
  },
  {
    type: "image",
    src: "/images/home-portfolio-tea-branding.jpg",
    alt: "The Loving Tea branding and packaging",
  },
  {
    type: "image",
    src: "/images/home-portfolio-team-kit.jpg",
    alt: "English Tea Shop team kit design",
  },
  {
    type: "image",
    src: "/images/home-portfolio-light-polo.jpg",
    alt: "English Tea Shop light blue polo design",
  },
];

const INTERVAL = 5000;

/* Extract YouTube ID from full URL or bare ID */
function parseYouTubeId(input: string): string {
  const match = input.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : input;
}

function VideoFileBackground({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

function YouTubeModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  const id = parseYouTubeId(videoId);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-[90vw] max-w-5xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="w-full h-full rounded-sm"
          title="Showreel"
        />
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-primary transition-colors"
        >
          <FaTimes size={22} />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [youtubeOpen, setYoutubeOpen] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setCurrentSlide(idx);
    setProgress(0);
  }, []);
  const next = useCallback(() => goTo((currentSlide + 1) % slides.length), [currentSlide, goTo]);
  const prev = useCallback(() => goTo((currentSlide - 1 + slides.length) % slides.length), [currentSlide, goTo]);

  /* Role cycling */
  useEffect(() => {
    const t = setInterval(() => setCurrentRoleIndex((p) => (p + 1) % roles.length), 3000);
    return () => clearInterval(t);
  }, []);

  /* Progress bar */
  useEffect(() => {
    if (paused || youtubeOpen) return;
    setProgress(0);
    const tick = 50;
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + (tick / INTERVAL) * 100;
      });
    }, tick);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [currentSlide, paused, youtubeOpen]);

  /* Auto-advance */
  useEffect(() => {
    if (paused || youtubeOpen) return;
    autoRef.current = setInterval(next, INTERVAL);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [currentSlide, paused, youtubeOpen, next]);

  const safeSlideIndex = slides.length > 0 ? currentSlide % slides.length : 0;
  const slide = slides[safeSlideIndex];

  return (
    <>
      <section
        id="home"
        className="relative w-full h-screen overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── Slide backgrounds ── */}
        <AnimatePresence mode="crossfade">
          <motion.div
            key={safeSlideIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {slide.type === "image" && (
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            )}
            {slide.type === "video" && (
              <VideoFileBackground src={slide.src} poster={slide.poster} />
            )}
            {slide.type === "youtube" && (
              <img
                src={slide.poster}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Dark gradient overlay ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20 z-10" />

        {/* ── YouTube play button ── */}
        {slide.type === "youtube" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setYoutubeOpen((slide as YouTubeSlide).videoId)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group"
          >
            <div className="w-20 h-20 rounded-full border-2 border-white/70 flex items-center justify-center bg-black/40 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
              <FaPlay size={24} className="text-white ml-1" />
            </div>
            {(slide as YouTubeSlide).label && (
              <p className="mt-3 text-white/80 text-xs tracking-widest uppercase text-center">
                {(slide as YouTubeSlide).label}
              </p>
            )}
          </motion.button>
        )}

        {/* ── Hero text content ── */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <p className="text-primary tracking-[0.4em] uppercase text-sm mb-5">Portfolio 2025</p>
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif leading-none mb-4 drop-shadow-2xl">
              Chandima<br />Kosala
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="h-10 mb-8"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentRoleIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="text-xl md:text-2xl font-light text-white/80 tracking-wide"
              >
                {roles[currentRoleIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-10"
          >
            <a
              href="#portfolio"
              className="bg-primary text-black px-9 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-white transition-colors"
            >
              View Portfolio
            </a>
            <a
              href="#contact"
              className="border border-white/40 text-white px-9 py-4 uppercase tracking-widest text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              Contact Me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-6 text-white/50"
          >
            <a href="https://www.linkedin.com/in/chandima-kosala-gange-4b962644?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><FaLinkedin size={20} /></a>
            <a href="https://www.behance.net/Chandimakosalagange" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><SiBehance size={20} /></a>
            <a href="https://www.instagram.com/artbyckg?stkn=MTZkZTh0MGtmaTNndA%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><SiInstagram size={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><SiFacebook size={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><SiWhatsapp size={20} /></a>
          </motion.div>
        </div>

        {/* ── GC Logo — bottom left ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-16 left-8 z-20 hidden md:block"
        >
          <img
            src="/images/logo-gc.jpg"
            alt="GC Logo"
            className="w-14 h-14 object-contain opacity-70 hover:opacity-100 transition-opacity duration-500"
          />
        </motion.div>

        {/* ── Apple-style Prev / Next arrows ── */}
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/25 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={12} className="text-white/80 group-hover:text-white transition-colors" />
        </button>
        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/25 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <FaChevronRight size={12} className="text-white/80 group-hover:text-white transition-colors" />
        </button>

        {/* ── Apple-style progress-line navigation ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-[6px]">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-[3px] rounded-full overflow-hidden transition-all duration-500 cursor-pointer"
              style={{ width: i === safeSlideIndex ? 36 : 18 }}
            >
              {/* Track */}
              <div className="absolute inset-0 bg-white/25 rounded-full" />
              {/* Fill — animated for active, full for past, empty for future */}
              {i === safeSlideIndex ? (
                <motion.div
                  key={`fill-${safeSlideIndex}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0, ease: "linear" }}
                  className="absolute inset-0 bg-white rounded-full origin-left"
                  style={{ scaleX: progress / 100 }}
                />
              ) : (
                <div className={`absolute inset-0 rounded-full ${i < safeSlideIndex ? "bg-white/70" : "bg-transparent"}`} />
              )}
              {/* Video indicator dot */}
              {s.type === "youtube" && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <FaPlay size={5} className={i === safeSlideIndex ? "text-primary" : "text-white/30"} />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Slide counter (top-right, Apple style) ── */}
        <div className="absolute top-28 right-7 z-20 hidden md:flex items-center gap-2 text-white/40 text-xs tracking-[0.2em] font-light">
          <span className="text-white/80">{String(safeSlideIndex + 1).padStart(2, "0")}</span>
          <span className="w-4 h-[1px] bg-white/30 inline-block" />
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
      </section>

      {/* ── YouTube lightbox modal ── */}
      <AnimatePresence>
        {youtubeOpen && (
          <YouTubeModal videoId={youtubeOpen} onClose={() => setYoutubeOpen(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
