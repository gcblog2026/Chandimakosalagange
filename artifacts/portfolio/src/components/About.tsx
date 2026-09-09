import { motion } from "framer-motion";
import { Target, Eye, Briefcase, GraduationCap } from "lucide-react";

const cards = [
  {
    icon: Target,
    title: "Mission",
    desc: "To create meaningful, innovative, and high-quality design solutions that help businesses build strong brands and connect with their customers. Through creativity, strategic thinking, and attention to detail, I aim to deliver exceptional branding, packaging, web design, and visual communication that drives business growth and creates lasting value.",
  },
  {
    icon: Eye,
    title: "Vision",
    desc: "To become a globally recognized creative professional and trusted brand developer, empowering businesses with outstanding branding, packaging, digital experiences, and visual storytelling. I aspire to inspire creativity, embrace innovation, and contribute to the success of brands through world-class design and professional excellence.",
  },
  {
    icon: Briefcase,
    title: "Experience",
    desc: "20+ years across publishing, flexo & offset print production, packaging design, brand identity, advertisement design, and digital media — currently Senior Graphic Designer at Amazon Trading / English Tea Shop.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    desc: "Diploma & Certificate in Graphic Designing — INGRIN. Advanced Multimedia Web Design & Development Techniques — University of Colombo School of Computing.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function About() {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-primary tracking-[0.3em] uppercase text-xs mb-4">Who I Am</p>
          <h2 className="text-5xl md:text-6xl font-serif mb-6">About Me</h2>
          <div className="w-16 h-[1px] bg-primary" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-white/70 text-lg leading-relaxed font-light">
              I am <span className="text-white font-medium">Chandima Kosala</span>, a passionate and creative{" "}
              <span className="text-primary font-medium">Graphic Designer, Brand Developer, Packaging Designer, Web Developer, Multimedia Designer, and Brand Photographer</span>{" "}
              with years of professional experience in building impactful brands and visual identities.
            </p>
            <p className="text-white/55 leading-relaxed font-light">
              I specialize in <span className="text-white/75">brand identity design, tea packaging design, product packaging, logo design, label design, print and digital media, advertising, web design, and creative marketing materials</span>. My expertise extends to <span className="text-white/75">brand photography</span>, creating high-quality product and promotional visuals that strengthen brand recognition and connect with customers.
            </p>
            <p className="text-white/50 leading-relaxed font-light">
              From concept to completion, I focus on delivering creative, modern, and market-driven designs that combine innovation with functionality. Whether developing a new brand, designing premium packaging, creating engaging websites, or producing professional brand photography, my goal is to help businesses stand out and leave a lasting impression.
            </p>
            <div className="border-l-2 border-primary/60 pl-5 mt-4">
              <p className="text-white/80 italic font-light leading-relaxed">
                "Turning ideas into powerful brands through creative design, strategic branding, innovative packaging, and compelling visual storytelling."
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {cards.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={cardVariants}
                className="border border-white/10 bg-white/[0.02] p-6 hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-500 group"
                data-testid={`card-about-${title.toLowerCase()}`}
              >
                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-4 group-hover:border-primary/60 transition-colors">
                  <Icon size={18} className="text-primary" />
                </div>
                <h4 className="font-serif text-lg mb-2">{title}</h4>
                <p className="text-white/50 text-sm leading-relaxed font-light">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
