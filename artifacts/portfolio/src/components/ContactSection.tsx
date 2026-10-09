import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiBehance, SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { CheckCircle2, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = String(import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "").trim();
const TEMPLATE_ID = String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "").trim();
const PUBLIC_KEY = String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "").trim();
const TO_EMAIL = "gckosala@gmail.com";

const socials = [
  { Icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/chandima-kosala-gange-4b962644?utm_source=share_via&utm_content=profile&utm_medium=member_ios", color: "hover:text-[#0077b5]" },
  { Icon: SiBehance, label: "Behance", href: "https://www.behance.net/Chandimakosalagange", color: "hover:text-[#1769ff]" },
  { Icon: SiInstagram, label: "Instagram", href: "https://www.instagram.com/artbyckg?stkn=MTZkZTh0MGtmaTNndA%3D%3D&utm_source=qr", color: "hover:text-[#e4405f]" },
  { Icon: SiFacebook, label: "Facebook", href: "#", color: "hover:text-[#1877f2]" },
  { Icon: SiWhatsapp, label: "WhatsApp", href: "#", color: "hover:text-[#25d366]" },
];

type Field = {
  id: string;
  label: string;
  type: string;
  multiline?: boolean;
};

const fields: Field[] = [
  { id: "name", label: "Your Name", type: "text" },
  { id: "email", label: "Email Address", type: "email" },
  { id: "subject", label: "Subject", type: "text" },
  { id: "message", label: "Message", type: "text", multiline: true },
];

function FloatingField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (id: string, val: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;

  const baseClass =
    "w-full bg-transparent border-b border-white/20 focus:border-primary outline-none text-white py-3 px-0 transition-colors duration-300 font-light text-sm";

  return (
    <div className="relative mb-8" data-testid={`input-${field.id}`}>
      <label
        htmlFor={field.id}
        className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
          raised
            ? "text-[10px] tracking-widest uppercase text-primary -top-4"
            : "text-white/40 text-sm top-3"
        }`}
      >
        {field.label}
      </label>
      {field.multiline ? (
        <textarea
          id={field.id}
          rows={4}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          id={field.id}
          type={field.type}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
        />
      )}
    </div>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (id: string, val: string) => {
    setForm((prev) => ({ ...prev, [id]: val }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !TO_EMAIL) {
      setError("Email service is not configured yet. Please try again later.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formattedMessage = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Subject: ${form.subject || "(No subject)"}`,
        "",
        "Message:",
        form.message,
      ].join("\n");
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          /* Common EmailJS variable name variants — covers any template setup */
          from_name: form.name,
          user_name: form.name,
          name: form.name,
          from_email: form.email,
          user_email: form.email,
          email: form.email,
          reply_to: form.email,
          subject: form.subject || "(No subject)",
           message: formattedMessage,
           message_html: formattedMessage.replace(/\n/g, "<br />"),
           to_name: "Chandima Kosala",
           ...(TO_EMAIL ? { to_email: TO_EMAIL } : {}),
        },
        PUBLIC_KEY
      );
      console.log("EmailJS success:", result.status, result.text);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      const ejsErr = err as { status?: number; text?: string; message?: string };
      console.error("EmailJS error:", ejsErr);
      const status = ejsErr.status ?? "?";
      const detail = ejsErr.text || ejsErr.message || "Unknown error";
      const normalizedDetail = detail.toLowerCase();
      if (String(status) === "412" || normalizedDetail.includes("invalid grant")) {
        setError("Email delivery needs the Gmail account connected to EmailJS to be reconnected.");
      } else if (String(status) === "401" || normalizedDetail.includes("public key")) {
        setError("Authentication failed — please check your EmailJS Public Key in Replit Secrets.");
      } else if (String(status) === "400") {
        setError("Template or Service ID not found — check your EmailJS Service ID and Template ID.");
      } else {
        setError(`Could not send (${status}: ${detail}). Please try again later.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[130px] -z-10" />

      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-primary tracking-[0.3em] uppercase text-xs mb-4">Say Hello</p>
          <h2 className="text-5xl md:text-6xl font-serif mb-6">Get In Touch</h2>
          <div className="w-16 h-[1px] bg-primary" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                  data-testid="success-message"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle2 size={56} className="text-primary mx-auto mb-6" />
                  </motion.div>
                  <h3 className="font-serif text-2xl mb-3">Message Sent</h3>
                  <p className="text-white/50 font-light text-sm mb-8">
                    Thank you for reaching out. I'll get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors"
                    data-testid="button-send-another"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                >
                  {fields.map((f) => (
                    <FloatingField
                      key={f.id}
                      field={f}
                      value={form[f.id as keyof typeof form]}
                      onChange={handleChange}
                    />
                  ))}

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-start gap-2 mb-6 text-red-400 text-xs font-light"
                        data-testid="error-message"
                      >
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    data-testid="button-submit-contact"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-primary text-black px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

           {/* Social links */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-6">Connect</p>
              <a
                href={`mailto:${TO_EMAIL}`}
                className="inline-block mb-6 text-sm text-white/60 hover:text-primary transition-colors"
              >
                {TO_EMAIL}
              </a>
              <div className="flex items-center gap-6">
                {socials.map(({ Icon, label, href, color }) => (
                  <a
                    key={label}
                     href={href}
                     target="_blank"
                     rel="noreferrer"
                    aria-label={label}
                    data-testid={`link-social-${label.toLowerCase()}`}
                    className={`text-white/50 transition-colors duration-300 ${color}`}
                  >
                    <Icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
