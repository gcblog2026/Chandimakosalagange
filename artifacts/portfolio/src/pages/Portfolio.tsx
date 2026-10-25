import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import PortfolioSection from "@/components/PortfolioSection";
import CVSection from "@/components/CVSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Minimal loading duration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="theme-page-shell bg-black min-h-screen text-white selection:bg-primary selection:text-black">
      {loading && <LoadingScreen />}
      
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <PortfolioSection />
        <CVSection />
        <ContactSection />
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
