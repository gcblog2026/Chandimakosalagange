import { useRef, useState, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";

const skills = [
  { name: "Branding", pct: 96 },
  { name: "Graphic Design", pct: 95 },
  { name: "Packaging Design", pct: 93 },
  { name: "Adobe Photoshop", pct: 92 },
  { name: "Adobe Illustrator", pct: 90 },
  { name: "Adobe InDesign", pct: 90 },
  { name: "Microsoft Office", pct: 90 },
  { name: "Canva", pct: 90 },
  { name: "Print Design", pct: 88 },
  { name: "HTML / CSS", pct: 88 },
  { name: "Adobe After Effects", pct: 85 },
  { name: "WordPress", pct: 82 },
  { name: "Adobe Premiere Pro", pct: 80 },
];

function AnimatedCounter({ value, inView }: { value: number; inView: boolean }) {
  const [display, setDisplay] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={nodeRef}>{display}</span>;
}

function SkillBar({ name, pct, index }: { name: string; pct: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="mb-6" data-testid={`skill-bar-${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm uppercase tracking-widest text-white/70 font-light">{name}</span>
        <span className="text-primary text-sm font-light tabular-nums">
          <AnimatedCounter value={pct} inView={inView} />%
        </span>
      </div>
      <div className="h-[2px] bg-white/10 w-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.07, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-32 bg-white/[0.01] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-primary tracking-[0.3em] uppercase text-xs mb-4">Expertise</p>
          <h2 className="text-5xl md:text-6xl font-serif mb-6">Skills</h2>
          <div className="w-16 h-[1px] bg-primary" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
          {skills.map((skill, i) => (
            <SkillBar key={skill.name} name={skill.name} pct={skill.pct} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
