import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Instagram as InstagramIcon,
  Pause,
  Play,
} from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const slides = [
  {
    image: "/images/portfolio/tea-loving-lemon-mango-chocolate.png",
    title: "Lemon Mango Tea & Chocolate",
    caption: "A vibrant Loving Tea packaging story built around colour, flavour, and emotion.",
  },
  {
    image: "/images/portfolio/tea-loving-green-lemon-cans.png",
    title: "Green Tea with Lemon",
    caption: "Fresh iced tea cans styled for a bright, easygoing summer moment.",
  },
  {
    image: "/images/portfolio/tea-loving-ginger-collection.png",
    title: "Ginger Tea Collection",
    caption: "Warm ginger tones and tactile details create a comforting tea ritual.",
  },
  {
    image: "/images/portfolio/tea-loving-ginger-display.png",
    title: "Ginger Tea Retail Display",
    caption: "Packaging extended into a memorable point-of-sale display experience.",
  },
  {
    image: "/images/portfolio/tea-loving-tea-bar.png",
    title: "The Loving Tea Bar",
    caption: "A complete tea-bar atmosphere where every pack works as part of the brand world.",
  },
  {
    image: "/images/portfolio/tea-loving-chocolate-bar.png",
    title: "Chocolate Bar Collection",
    caption: "A rich display of Loving Tea and chocolate packaging with a shared visual language.",
  },
  {
    image: "/images/portfolio/tea-loving-tea-choco-collection.png",
    title: "Matcha Tea & Chocolate",
    caption: "Matcha, tea tins, and chocolate packs brought together through bold packaging design.",
  },
  {
    image: "/images/portfolio/tea-loving-rooibos-matcha-tins.png",
    title: "Rooibos, Green & Black Tea",
    caption: "A warm tin collection showing how one identity can stretch across different flavours.",
  },
  {
    image: "/images/portfolio/tea-loving-tea-tin-range.png",
    title: "Tea Tin Range",
    caption: "A colourful family of tea tins presented as one distinctive Loving Tea collection.",
  },
];

export default function InstagramPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeSlide = slides[activeIndex];

  const goToSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-primary text-sm uppercase tracking-widest transition-colors mb-10 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Portfolio
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <p className="text-primary tracking-[0.3em] uppercase text-xs mb-4">Visual Stories</p>
              <h1 className="text-5xl md:text-7xl font-serif mb-5">Instagram</h1>
              <div className="w-16 h-[1px] bg-primary mb-6" />
              <p className="text-white/50 max-w-xl font-light leading-relaxed">
                A moving gallery of packaging, flavour, and brand worlds from The Loving Tea collection.
              </p>
            </div>
            <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-widest">
              <InstagramIcon size={17} className="text-primary" />
              <span>Tea Packaging Stories</span>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative overflow-hidden border border-white/10 bg-white/[0.03]"
            aria-label="Tea packaging image slider"
          >
            <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="relative min-h-[360px] overflow-hidden bg-black">
                <motion.img
                  key={activeSlide.image}
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <p className="text-white/70 text-xs uppercase tracking-widest">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => goToSlide(activeIndex - 1)}
                      aria-label="Previous image"
                      className="flex h-11 w-11 items-center justify-center border border-white/30 bg-black/30 text-white transition-colors hover:border-primary hover:text-primary"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(activeIndex + 1)}
                      aria-label="Next image"
                      className="flex h-11 w-11 items-center justify-center border border-white/30 bg-black/30 text-white transition-colors hover:border-primary hover:text-primary"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-7 md:p-10">
                <div>
                  <p className="text-primary text-xs uppercase tracking-[0.25em] mb-6">Featured frame</p>
                  <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-5">{activeSlide.title}</h2>
                  <p className="text-white/50 font-light leading-relaxed">{activeSlide.caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlaying((playing) => !playing)}
                  className="mt-10 inline-flex w-fit items-center gap-3 border-b border-primary/50 pb-3 text-xs uppercase tracking-widest text-primary transition-colors hover:text-white"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  {isPlaying ? "Pause slideshow" : "Play slideshow"}
                </button>
              </div>
            </div>
          </motion.section>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.image}
                onClick={() => goToSlide(index)}
                aria-label={`Show ${slide.title}`}
                aria-current={index === activeIndex}
                className={`relative aspect-square overflow-hidden border transition-all duration-300 ${
                  index === activeIndex ? "border-primary opacity-100" : "border-transparent opacity-45 hover:opacity-85"
                }`}
              >
                <img src={slide.image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.title}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-1 transition-all duration-300 ${
                  index === activeIndex ? "w-10 bg-primary" : "w-3 bg-white/20 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}