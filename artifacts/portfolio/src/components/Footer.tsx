import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { SiBehance, SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

const socials = [
  { Icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/chandima-kosala-gange-4b962644?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
  { Icon: SiBehance, label: "Behance", href: "https://www.behance.net/Chandimakosalagange" },
  { Icon: SiInstagram, label: "Instagram", href: "https://www.instagram.com/artbyckg?stkn=MTZkZTh0MGtmaTNndA%3D%3D&utm_source=qr" },
  { Icon: SiFacebook, label: "Facebook", href: "#" },
  { Icon: SiWhatsapp, label: "WhatsApp", href: "#" },
];

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="border-t border-white/10 py-10">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-xs font-light tracking-widest uppercase text-center md:text-left">
            Chandima Kosala &copy; 2025 — All Rights Reserved
          </p>

          <div className="flex items-center gap-5">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                 href={href}
                 target="_blank"
                 rel="noreferrer"
                aria-label={label}
                data-testid={`footer-link-${label.toLowerCase()}`}
                className="text-white/30 hover:text-primary transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

        </div>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            data-testid="button-back-to-top"
            className="fixed bottom-8 right-8 z-40 w-12 h-12 border border-primary/40 bg-black hover:bg-primary hover:border-primary transition-all duration-300 flex items-center justify-center group"
          >
            <ArrowUp size={18} className="text-primary group-hover:text-black transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
