import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const posts = [
  {
    id: 1,
    title: "The Art of Tea Packaging Design: Creating Brands That Brew Emotion",
    excerpt:
      "Tea packaging is more than a container — it's the first conversation between your brand and the customer. Discover how thoughtful design elevates a simple product into a premium experience.",
    category: "Packaging Design",
    date: "June 2025",
    readTime: "5 min read",
    image: "/images/portfolio/loving-tea-tins.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Flexographic Printing: Why It's the Gold Standard for Food Packaging",
    excerpt:
      "After 15+ years working in Flexo print production, I share the technical insights and creative decisions that make flexographic printing the preferred choice for food and beverage packaging.",
    category: "Print Design",
    date: "May 2025",
    readTime: "7 min read",
    image: "/images/portfolio/green-tea-lemon-full.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Building a Brand Identity from Scratch: Lessons from The Loving Choco Co.",
    excerpt:
      "A behind-the-scenes look at developing the playful, character-driven identity for The Loving Choco Co. — from initial concept sketches to final packaging execution.",
    category: "Branding",
    date: "April 2025",
    readTime: "6 min read",
    image: "/images/portfolio/loving-choco-brand.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Colour Separation in Flexo Printing: A Designer's Practical Guide",
    excerpt:
      "Colour separation is one of the most technical aspects of print design, yet it's often misunderstood. Here's what every packaging designer needs to know before sending files to press.",
    category: "Print Design",
    date: "March 2025",
    readTime: "8 min read",
    image: "/images/portfolio/mango-lime.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Why Brand Photography Matters More Than Ever in 2025",
    excerpt:
      "Generic stock photos are no longer enough. Brands need authentic, product-centric visuals that tell a story. Here's how professional brand photography transforms marketing materials.",
    category: "Photography",
    date: "February 2025",
    readTime: "4 min read",
    image: "/images/portfolio/loving-choco-flat.jpg",
    featured: false,
  },
  {
    id: 6,
    title: "From Offset to Digital: How Print Design Skills Shape Better Web Designers",
    excerpt:
      "My journey from newspaper layout design at Oakwood Publishing to digital web design taught me that the best digital designers understand print fundamentals — here's why.",
    category: "Design Thinking",
    date: "January 2025",
    readTime: "5 min read",
    image: "/images/portfolio/loving-tea-brand.jpg",
    featured: false,
  },
];

const categories = ["All", "Packaging Design", "Print Design", "Branding", "Photography", "Design Thinking"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  const featured = posts.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || activeCategory !== "All");

  return (
    <div className="theme-page-shell bg-black min-h-screen text-white selection:bg-primary selection:text-black">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12">

          {/* Back link */}
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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <p className="text-primary tracking-[0.3em] uppercase text-xs mb-4">Insights & Ideas</p>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">Design Journal</h1>
            <div className="w-16 h-[1px] bg-primary mb-6" />
            <p className="text-white/50 max-w-xl font-light leading-relaxed">
              Thoughts on branding, packaging design, print production, and the creative process — from 20+ years in the industry.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3 mt-12 mb-16"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-widest px-5 py-2 border transition-all duration-300 ${
                  activeCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/15 text-white/50 hover:border-white/40 hover:text-white/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Featured Post */}
          {activeCategory === "All" && featured && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-16 border border-white/10 bg-white/[0.02] hover:border-primary/30 transition-all duration-500 group overflow-hidden cursor-pointer"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="overflow-hidden h-64 lg:h-auto">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-10 flex flex-col justify-center">
                  <span className="text-primary text-xs uppercase tracking-widest mb-4 inline-flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-primary" /> Featured Post
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif mb-4 leading-snug group-hover:text-primary/90 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-white/50 font-light leading-relaxed mb-6 text-sm">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-white/35 text-xs">
                    <span className="flex items-center gap-1.5"><Calendar size={12} />{featured.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} />{featured.readTime}</span>
                    <span className="flex items-center gap-1.5"><Tag size={12} />{featured.category}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Post Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {rest.map((post) => (
              <motion.article
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                className="border border-white/10 bg-white/[0.02] hover:border-primary/30 transition-all duration-500 group overflow-hidden flex flex-col cursor-pointer"
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-primary text-[10px] uppercase tracking-widest mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg leading-snug mb-3 group-hover:text-primary/90 transition-colors flex-1">
                    {post.title}
                  </h3>
                  <p className="text-white/45 text-sm font-light leading-relaxed mb-5">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-white/30 text-xs mt-auto pt-4 border-t border-white/[0.08]">
                    <span className="flex items-center gap-1.5"><Calendar size={11} />{post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={11} />{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Coming Soon Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-white/25 text-sm font-light tracking-wider">
              More articles coming soon — the full blog is launching shortly.
            </p>
          </motion.div>

        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
