import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const experience = [
  {
    role: "Senior Graphic Designer",
    company: "Amazon Trading / English Tea Shop",
    period: "5th Nov 2012 — Present",
    years: "Currently Employed",
    desc: "With over a decade of experience, specialising in creating impactful and visually appealing designs that effectively communicate brand stories. Print Design: Proficient in flexographic and offset printing techniques, delivering high-quality designs for tea packaging, tea tags, and labels. Promotional Materials: Skilled in crafting layout designs for a variety of marketing collateral, including flyers, banners, and leaflets, ensuring consistency with brand identity. Digital Design: Experienced in creating engaging social media posts tailored to enhance brand visibility and customer engagement.",
  },
  {
    role: "Executive Graphic Designer",
    company: "Shiran Perm Poly Packs (Pvt) Ltd",
    period: "4th Aug 2009 — 30th Sep 2010",
    years: "1 Year",
    desc: "The graphic designer successfully translated the subject matter into concrete flexo print designs and layout designs for promotional materials and sales collateral.",
  },
  {
    role: "Executive Graphic Designer — Flexo Department",
    company: "Premadasa Photo Engravers Limited",
    period: "11th Jul 2005 — 30th Apr 2009",
    years: "5 Years",
    desc: "Effectively managed and coordinated Flexo Printing Design Projects from concept through completion. Worked closely with clients to understand their vision, conceive designs, and consistently meet deadlines and requirements. Specialised in layout designing and colour separation.",
  },
  {
    role: "Layout & Advertisement Designer",
    company: "Medaperadiga Newspaper — Oakwood Publishing (Pvt) Ltd",
    period: "12th May 2004 — 30th Jun 2005",
    years: "2 Years",
    desc: "Freelance employed as Layout & Advertisement Designer for Offset Printing, specialising in designing and page layout design.",
  },
];

const education = [
  {
    degree: "Diploma in Graphic Designing",
    institution: "INGRIN (Institute of Printing & Graphic)",
    period: "",
  },
  {
    degree: "Certificate in Graphic Designing",
    institution: "INGRIN (Institute of Printing & Graphic)",
    period: "",
  },
  {
    degree: "Advanced Multimedia Web Design &",
    institution: "University of Colombo School of Computing",
    period: "Development Techniques",
  },
];

const coreSkills = [
  "Brand Identity", "Flexo Print Design", "Offset Printing", "Layout Design",
  "Colour Separation", "Packaging Design", "Adobe CC Suite", "Advertisement Design",
  "Typography", "Print Production", "Page Layout", "Visual Communication",
];

export default function CVSection() {
  return (
    <section
      id="cv"
      className="py-32 bg-white/[0.01] relative"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary tracking-[0.3em] uppercase text-xs mb-4">Credentials</p>
          <h2 className="text-5xl md:text-6xl font-serif mb-6">Curriculum Vitae</h2>
          <div className="w-16 h-[1px] bg-primary" />
        </motion.div>

        {/* Protected Document Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 mb-8 text-xs text-white/40 uppercase tracking-widest"
          data-testid="cv-protection-label"
        >
          <ShieldCheck size={14} className="text-primary/60" />
          <span>View Only — Protected Document</span>
        </motion.div>

        {/* CV Document */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border border-white/10 bg-[#080808] select-none pointer-events-none"
          style={{ userSelect: "none" }}
          data-testid="cv-document"
        >
          {/* CV Header */}
          <div className="border-b border-white/10 p-10 md:p-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif mb-2">Chandima Kosala</h1>
                <p className="text-primary tracking-[0.3em] uppercase text-xs">
                  Graphic Designer — Brand Developer — Web Developer
                </p>
              </div>
              <div className="text-white/50 text-sm space-y-1 text-right font-light">
                <p>Sri Lanka</p>
                <p>chandimakosala@gmail.com</p>
                <p>behance.net/chandimakosala</p>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left column */}
            <div className="lg:col-span-1 space-y-10">
              {/* Profile */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-primary mb-4">Profile</h3>
                <p className="text-white/60 text-sm leading-relaxed font-light">
                  Creative professional with 20+ years of experience in graphic design, specialising in
                  flexo and offset print production, brand identity, layout design, advertisement design,
                  and colour separation across publishing, packaging, and trading industries.
                </p>
              </div>

              {/* Core Skills */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-primary mb-4">Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {coreSkills.map((s) => (
                    <span
                      key={s}
                      className="text-xs border border-white/15 text-white/60 px-3 py-1 font-light"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Professional Qualification */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-primary mb-4">Professional Qualification</h3>
                {education.map((e) => (
                  <div key={e.degree} className="mb-4">
                    <p className="text-white/80 text-sm font-light">{e.degree}</p>
                    <p className="text-white/40 text-xs mt-1">{e.institution}</p>
                    {e.period && <p className="text-primary/70 text-xs mt-1 tracking-wider">{e.period}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2">
              <h3 className="text-xs uppercase tracking-widest text-primary mb-6">Experience</h3>
              <div className="space-y-8">
                {experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l border-white/10">
                    <div className="absolute -left-[3px] top-2 w-[5px] h-[5px] rounded-full bg-primary" />
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className="text-base font-semibold text-white/90">{exp.role}</h4>
                        <p className="text-white/55 text-sm font-light">{exp.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-primary text-[11px] tracking-widest whitespace-nowrap">{exp.period}</span>
                        <span className="text-[10px] border border-primary/30 text-primary/70 px-2 py-0.5 tracking-widest uppercase whitespace-nowrap">{exp.years}</span>
                      </div>
                    </div>
                    <p className="text-white/45 text-sm leading-relaxed font-light mt-2">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
