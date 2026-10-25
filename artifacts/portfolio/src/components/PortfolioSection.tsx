import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";

const categories = [
  "All",
  "Tea Packaging",
  "Branding",
  "Print Design",
  "T-shirt Design",
  "Poster Design",
];

const projects = [
  {
    id: 1,
    title: "The Loving Tea — Green Tea with Lemon Can",
    category: "Tea Packaging",
    image: "/images/portfolio/green-tea-lemon-full.jpg",
  },
  {
    id: 2,
    title: "The Loving Tea — Iced Tea Can Range",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-cans.jpg",
  },
  {
    id: 3,
    title: "The Loving Tea — Green Tea Lemon Detail",
    category: "Tea Packaging",
    image: "/images/portfolio/green-tea-lemon-md.jpg",
  },
  {
    id: 4,
    title: "The Loving Tea — Peach Mango & Mango Tea Tins",
    category: "Tea Packaging",
    image: "/images/portfolio/loving-tea-tins.jpg",
  },
  {
    id: 5,
    title: "The Loving Tea — Lemon Mango Collection",
    category: "Tea Packaging",
    image: "/images/portfolio/loving-lemon-mango.jpg",
  },
  {
    id: 6,
    title: "The Loving Tea — Mango with Lime Tin",
    category: "Tea Packaging",
    image: "/images/portfolio/mango-lime.jpg",
  },
  {
    id: 16,
    title: "The Loving Tea — Lemon Mango Tea & Chocolate",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-lemon-mango-chocolate.png",
  },
  {
    id: 17,
    title: "The Loving Tea — Green Tea with Lemon",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-green-lemon-cans.png",
  },
  {
    id: 18,
    title: "The Loving Tea — Ginger Tea Collection",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-ginger-collection.png",
  },
  {
    id: 19,
    title: "The Loving Tea — Ginger Tea Retail Display",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-ginger-display.png",
  },
  {
    id: 20,
    title: "The Loving Tea — Tea Bar Collection",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-tea-bar.png",
  },
  {
    id: 21,
    title: "The Loving Tea — Chocolate Bar Collection",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-chocolate-bar.png",
  },
  {
    id: 22,
    title: "The Loving Tea — Matcha Tea & Chocolate Collection",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-tea-choco-collection.png",
  },
  {
    id: 23,
    title: "The Loving Tea — Rooibos, Green & Black Tea Tins",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-rooibos-matcha-tins.png",
  },
  {
    id: 24,
    title: "The Loving Tea — Tea Tin Range",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-loving-tea-tin-range.png",
  },
  {
    id: 28,
    title: "The Loving Tea — Green & Black Iced Tea",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-green-black-iced-tea.webp",
  },
  {
    id: 29,
    title: "The Loving Tea — Lemon Mixed Chocolate",
    category: "Tea Packaging",
    image: "/images/portfolio/tea-lemon-mixed-chocolate.webp",
  },
  {
    id: 7,
    title: "The Loving Choco Co. — Brand & Packaging",
    category: "Packaging",
    image: "/images/portfolio/loving-choco-flat.jpg",
  },
  {
    id: 8,
    title: "The Loving Choco Co. — Pineapple Mixed Chocolate",
    category: "Packaging",
    image: "/images/portfolio/pineapple-choco.jpg",
  },
  {
    id: 9,
    title: "The Loving Choco Co. — Brand Identity",
    category: "Branding",
    image: "/images/portfolio/loving-choco-brand.jpg",
  },
  {
    id: 10,
    title: "The Loving Tea — Brand Identity",
    category: "Branding",
    image: "/images/portfolio/loving-tea-brand.jpg",
  },
  {
    id: 25,
    title: "English Tea Shop — Women's Team Kit",
    category: "T-shirt Design",
    image: "/images/portfolio/tshirt-english-tea-shop-womens-kit-clean.png",
  },
  {
    id: 26,
    title: "English Tea Shop — Team Kit",
    category: "T-shirt Design",
    image: "/images/portfolio/tshirt-english-tea-shop-team-kit-clean.png",
  },
  {
    id: 27,
    title: "English Tea Shop — Light Blue Polo",
    category: "T-shirt Design",
    image: "/images/portfolio/tshirt-english-tea-shop-light-polo-clean.png",
  },
];

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<{ image: string; title: string } | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
        setZoom(1);
      } else if (event.key === "+" || event.key === "=") {
        setZoom((current) => Math.min(3, current + 0.25));
      } else if (event.key === "-") {
        setZoom((current) => Math.max(0.5, current - 0.25));
      } else if (event.key === "0") {
        setZoom(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const openLightbox = (image: string, title: string) => {
    setZoom(1);
    setLightbox({ image, title });
  };

  const closeLightbox = () => {
    setZoom(1);
    setLightbox(null);
  };

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-32 relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary tracking-[0.3em] uppercase text-xs mb-4">Selected Work</p>
          <h2 className="text-5xl md:text-6xl font-serif mb-6">Portfolio</h2>
          <div className="w-16 h-[1px] bg-primary" />
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 border ${
                activeFilter === cat
                  ? "border-primary text-black bg-primary"
                  : "border-white/20 text-white/60 hover:border-primary/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4 }}
                className={`group relative overflow-hidden cursor-pointer ${
                  project.category === "T-shirt Design" ? "aspect-[3/4]" : "aspect-[4/3]"
                } bg-white/5`}
                onClick={() => openLightbox(project.image, project.title)}
                data-testid={`portfolio-card-${project.id}`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-full transition-transform duration-700 ${
                    project.category === "T-shirt Design"
                      ? "object-contain bg-black/30 group-hover:scale-105"
                      : "object-cover group-hover:scale-110"
                  }`}
                />
                <div className="dark-surface absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500 flex flex-col items-center justify-center">
                  <ZoomIn
                    size={32}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3"
                  />
                  <p className="text-white text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 text-center px-4">
                    {project.title}
                  </p>
                  <span className="text-primary text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 mt-1">
                    {project.category}
                  </span>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full border border-white/10 bg-white/[0.02] py-20 text-center"
              >
                <p className="text-primary text-xs uppercase tracking-[0.25em] mb-4">
                  {activeFilter}
                </p>
                <p className="text-white/40 font-light">
                  New work for this collection will be added soon.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="dark-surface fixed inset-0 z-50 lightbox-overlay flex items-center justify-center p-6"
            onClick={closeLightbox}
            data-testid="lightbox-overlay"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label={lightbox.title}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-14 right-0 flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 bg-black/70 text-white transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                  onClick={() => setZoom((current) => Math.max(0.5, current - 0.25))}
                  aria-label="Zoom out"
                  title="Zoom out"
                  disabled={zoom <= 0.5}
                  data-testid="button-zoom-out"
                >
                  <ZoomOut size={17} />
                </button>
                <span className="min-w-12 text-center text-xs text-white/70" aria-live="polite">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 bg-black/70 text-white transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                  onClick={() => setZoom((current) => Math.min(3, current + 0.25))}
                  aria-label="Zoom in"
                  title="Zoom in"
                  disabled={zoom >= 3}
                  data-testid="button-zoom-in"
                >
                  <ZoomIn size={17} />
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 bg-black/70 text-white transition-colors hover:border-primary hover:text-primary"
                  onClick={() => setZoom(1)}
                  aria-label="Reset zoom"
                  title="Reset zoom"
                  data-testid="button-reset-zoom"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 bg-black/70 text-white transition-colors hover:border-primary hover:text-primary"
                  onClick={closeLightbox}
                  aria-label="Close image"
                  title="Close image"
                  data-testid="button-close-lightbox"
                >
                  <X size={18} />
                </button>
              </div>
              <div
                className="flex max-h-[80vh] w-full items-center justify-center overflow-auto"
                onWheel={(event) => {
                  event.preventDefault();
                  setZoom((current) =>
                    Math.min(3, Math.max(0.5, current + (event.deltaY < 0 ? 0.1 : -0.1))),
                  );
                }}
              >
                <img
                  src={lightbox.image}
                  alt={lightbox.title}
                  className="h-auto max-h-[80vh] max-w-full w-auto object-contain transition-transform duration-200"
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
              <p className="text-center text-white/70 text-sm uppercase tracking-widest mt-4">
                {lightbox.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
