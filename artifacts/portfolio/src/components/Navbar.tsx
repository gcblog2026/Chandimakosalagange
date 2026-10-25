import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTheme } from "next-themes";

const navLinks = [
  { name: "Home", href: "#home", section: true },
  { name: "About", href: "#about", section: true },
  { name: "Skills", href: "#skills", section: true },
  { name: "Portfolio", href: "#portfolio", section: true },
  { name: "CV", href: "#cv", section: true },
  { name: "Blog", href: "/blog", section: false },
  { name: "Instagram", href: "/instagram", section: false },
  { name: "Contact", href: "#contact", section: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [location] = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const isOnSpecialPage = location === "/blog" || location === "/instagram";
  const isLightTheme = resolvedTheme === "light";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (isOnSpecialPage) {
      window.location.href = "/" + href;
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <header
        className={`site-navbar fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Left: Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.section ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSectionClick(e, link.href)}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                  className="text-sm uppercase tracking-widest text-white/70 hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-widest transition-colors relative group ${
                     location === link.href ? "text-primary" : "text-white/70 hover:text-primary"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-2 left-0 h-[1px] bg-primary transition-all duration-300 ${
                       location === link.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )
            )}
          </nav>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Right: theme switch and GC Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(isLightTheme ? "dark" : "light")}
              aria-label={`Switch to ${isLightTheme ? "dark" : "light"} mode`}
              aria-pressed={isLightTheme}
              title={`Switch to ${isLightTheme ? "dark" : "light"} mode`}
              data-testid="button-theme-toggle"
              className="inline-flex h-10 w-10 sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 px-0 text-white/80 transition-colors hover:border-primary hover:text-primary sm:px-3"
            >
              {isLightTheme ? <Moon size={17} /> : <Sun size={17} />}
              <span className="hidden text-[11px] uppercase tracking-widest sm:inline">
                {isLightTheme ? "Dark mode" : "Light mode"}
              </span>
            </button>
            <Link
              href="/"
              data-testid="link-logo-home"
              className="block flex-shrink-0"
            >
              <img
                src="/images/logo-gc.jpg"
                alt="GC Logo"
                className="w-[70px] h-[70px] object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: "100%" }}
        transition={{ duration: 0.3 }}
        className="site-mobile-menu fixed inset-0 bg-black z-30 flex flex-col items-center justify-center md:hidden"
        style={{ pointerEvents: mobileMenuOpen ? "auto" : "none" }}
      >
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link) =>
            link.section ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className="text-2xl font-serif tracking-wider text-white hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-serif tracking-wider transition-colors ${
                   location === link.href ? "text-primary" : "text-white hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>
      </motion.div>
    </>
  );
}
