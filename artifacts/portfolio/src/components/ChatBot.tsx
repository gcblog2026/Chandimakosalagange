import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { SiWhatsapp } from "react-icons/si";
import { ChevronDown, ChevronUp } from "lucide-react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = String(import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "").trim();
const TEMPLATE_ID = String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "").trim();
const PUBLIC_KEY = String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "").trim();
const TO_EMAIL = String(import.meta.env.VITE_EMAILJS_TO_EMAIL ?? "").trim();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactStep = "name" | "email" | "phone" | "reason" | null;

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const QUICK_REPLIES = [
  "What services do you offer?",
  "Tell me about your experience",
  "Send me a message",
  "Show me your portfolio",
  "What software do you use?",
  "Are you available for work?",
];

type QA = { keywords: string[]; answer: string };

const FAQ: QA[] = [
  {
    keywords: ["service", "offer", "do", "work", "specialize", "specialise"],
    answer:
      "I offer a full range of graphic design services including:\n• Brand Identity & Logo Design\n• Flexo & Offset Print Design\n• Packaging Design\n• Advertisement & Layout Design\n• Page Layout & Colour Separation\n• Promotional Materials\n\nI have 20+ years of professional experience across print and digital media.",
  },
  {
    keywords: ["experience", "background", "career", "history", "work history", "year"],
    answer:
      "I have 20+ years of graphic design experience:\n\n🏢 Amazon Trading — Graphic Designer (Nov 2012 – Present)\n🏢 Shiran Perm Poly Packs — Graphic Designer (2009–2010)\n🏢 Premadasa Photo Engravers — Flexo Designer (2005–2009)\n🏢 Oakwood Publishing — Layout Designer (2004–2005)\n\nI've worked across publishing, packaging, and trading industries.",
  },
  {
    keywords: ["contact", "reach", "email", "phone", "whatsapp", "message", "hire", "talk"],
    answer:
      "I can collect your details and send a message to Chandima. Just say “send me a message” and I’ll guide you through it.",
  },
  {
    keywords: ["portfolio", "project", "work", "sample", "design", "see", "show", "example"],
    answer:
      "My portfolio includes work across:\n• Brand Identity & Branding\n• Packaging & Label Design\n• Tea Packaging Design\n• Web Design\n• Print & Promotional Design\n\nScroll to the Portfolio section to view my work, or click 'View Portfolio' on the homepage!",
  },
  {
    keywords: ["software", "tool", "use", "adobe", "skill", "program", "application"],
    answer:
      "I'm proficient in a wide range of professional design tools:\n\n🎨 Adobe Illustrator\n🖼️ Adobe Photoshop\n📄 Adobe InDesign\n⚡ Adobe After Effects\n\nI also specialise in colour separation, pre-press production, and flexo/offset print workflows.",
  },
  {
    keywords: ["available", "hire", "freelance", "free", "busy", "project", "new"],
    answer:
      "Yes, I'm currently open to new projects and collaborations! Say “send me a message” and I’ll collect your details.",
  },
  {
    keywords: ["price", "cost", "rate", "fee", "charge", "quote", "budget"],
    answer:
      "Pricing varies based on the project scope and requirements. Send your project details through the contact form or say “send me a message” for a custom quote.",
  },
  {
    keywords: ["who", "about", "chandima", "kosala", "yourself", "name", "person"],
    answer:
      "I'm Chandima Kosala — a professional Graphic Designer and Brand Developer based in Sri Lanka with 20+ years of experience.\n\nI specialise in brand identity, flexo/offset print production, packaging design, and visual communication. I'm currently working at Amazon Trading while also taking on creative projects.\n\nScroll to the About section to learn more!",
  },
  {
    keywords: ["brand", "logo", "identity", "branding"],
    answer:
      "Brand identity is one of my core specialisations! I create comprehensive brand identities including:\n• Logo design & visual identity\n• Brand style guides\n• Colour palette & typography\n• Brand collateral & stationery\n\nCheck the Portfolio section to see examples of my branding work.",
  },
  {
    keywords: ["print", "offset", "flexo", "packaging", "label"],
    answer:
      "Print production is my strongest area of expertise — spanning 20+ years! I specialise in:\n• Flexo print design & production\n• Offset printing design\n• Packaging & label design\n• Colour separation\n• Pre-press preparation\n\nI've worked at multiple print-focused companies including Premadasa Photo Engravers and Shiran Perm Poly Packs.",
  },
  {
    keywords: ["location", "based", "country", "sri lanka", "where"],
    answer:
      "I'm based in Sri Lanka 🇱🇰 and work with clients both locally and internationally. I'm comfortable working remotely and communicating across time zones.",
  },
];

const FALLBACK =
  "Thanks for your question! For more specific information, please use the Contact form below or say “send me a message” so I can collect your details.";

function getBotAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const qa of FAQ) {
    if (qa.keywords.some((kw) => lower.includes(kw))) {
      return qa.answer;
    }
  }
  return FALLBACK;
}

let msgId = 0;
const newMsg = (role: "bot" | "user", text: string): Message => ({
  id: ++msgId,
  role,
  text,
});

const WELCOME: Message = newMsg(
  "bot",
  "Hi! I'm Chandima Kosala Assistant 👋\n\nI can answer questions about his design services, experience, portfolio, and more. What would you like to know?"
);

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const [contactStep, setContactStep] = useState<ContactStep>(null);
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, newMsg("bot", text)]);
    if (!open) setUnread((n) => n + 1);
  };

  const startContactFlow = () => {
    setContactDetails({ name: "", email: "", phone: "", reason: "" });
    setContactStep("name");
    addBotMessage("I can send your message privately to Chandima. What is your name?");
  };

  const sendContactDetails = async (details: {
    name: string;
    email: string;
    phone: string;
    reason: string;
  }) => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !TO_EMAIL) {
      setContactStep(null);
      setTyping(false);
      addBotMessage("The contact service is not fully configured yet. Please use the Contact form below instead.");
      return;
    }

    try {
      const formattedMessage = [
        `Name: ${details.name}`,
        `Email: ${details.email}`,
        `Contact number: ${details.phone}`,
        `Reason for contacting: ${details.reason}`,
        "",
        "This contact request was submitted through Chandima Kosala Assistant.",
      ].join("\n");
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: details.name,
          user_name: details.name,
          name: details.name,
          from_email: details.email,
          user_email: details.email,
          email: details.email,
          reply_to: details.email,
          phone: details.phone,
          contact_number: details.phone,
          reason: details.reason,
          subject: `Contact request from ${details.name}`,
          message: formattedMessage,
          message_html: formattedMessage.replace(/\n/g, "<br />"),
          to_name: "Chandima Kosala",
          to_email: TO_EMAIL,
        },
        PUBLIC_KEY
      );
      setContactStep(null);
      setContactDetails({ name: "", email: "", phone: "", reason: "" });
      addBotMessage("Thank you. Your message has been sent to Chandima successfully.");
    } catch {
      setContactStep(null);
      addBotMessage("I couldn't send your message right now. Please use the Contact form below and try again.");
    } finally {
      setTyping(false);
    }
  };

  const handleContactInput = (value: string) => {
    const trimmed = value.trim();

    if (contactStep === "name") {
      if (!trimmed) {
        addBotMessage("Please enter your name so I can continue.");
        return;
      }
      setContactDetails((prev) => ({ ...prev, name: trimmed }));
      setContactStep("email");
      addBotMessage("Thanks. What email address should Chandima use to reply?");
      return;
    }

    if (contactStep === "email") {
      if (!EMAIL_PATTERN.test(trimmed)) {
        addBotMessage("Please enter a valid email address, for example name@example.com.");
        return;
      }
      setContactDetails((prev) => ({ ...prev, email: trimmed }));
      setContactStep("phone");
      addBotMessage("What is the best contact number for Chandima to reach you?");
      return;
    }

    if (contactStep === "phone") {
      if (!trimmed) {
        addBotMessage("Please enter a contact number so I can continue.");
        return;
      }
      setContactDetails((prev) => ({ ...prev, phone: trimmed }));
      setContactStep("reason");
      addBotMessage("What is the reason for contacting Chandima?");
      return;
    }

    if (contactStep === "reason") {
      if (!trimmed) {
        addBotMessage("Please tell me briefly why you would like to contact Chandima.");
        return;
      }
      const details = { ...contactDetails, reason: trimmed };
      setTyping(true);
      void sendContactDetails(details);
    }
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMsg = newMsg("user", trimmed);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (contactStep) {
      handleContactInput(trimmed);
      return;
    }

    const lower = trimmed.toLowerCase();
    if (
      lower.includes("send me a message") ||
      lower.includes("contact me") ||
      lower.includes("get in touch") ||
      lower.includes("send an email") ||
      lower.includes("hire me")
    ) {
      startContactFlow();
      return;
    }

    setTyping(true);

    setTimeout(() => {
      const answer = getBotAnswer(trimmed);
      setTyping(false);
      addBotMessage(answer);
    }, 900 + Math.random() * 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="dark-surface fixed bottom-24 right-5 z-[100] w-[340px] sm:w-[380px] flex flex-col"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            <div className="flex flex-col rounded-sm border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden"
              style={{ maxHeight: "calc(100vh - 120px)" }}>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d0d0d] shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/assistant-profile.jpg"
                    alt="Chandima Kosala logo"
                    className="h-10 w-10 rounded-sm border border-primary/40 bg-black object-contain"
                  />
                  <div>
                    <p className="text-white text-sm font-medium leading-none">Chandima Kosala Assistant</p>
                    <p className="text-primary text-[10px] tracking-widest uppercase mt-0.5">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Hide assistant"
                  title="Hide assistant"
                  className="flex h-8 w-8 items-center justify-center border border-white/10 text-white/40 hover:border-primary/50 hover:text-primary transition-colors"
                >
                  <ChevronDown size={17} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-sm text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-primary text-black font-medium"
                          : "bg-white/5 border border-white/8 text-white/80"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-sm flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-primary/60"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              {messages.length <= 2 && !typing && (
                <div className="px-4 pb-3 flex flex-wrap gap-2 shrink-0">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] border border-white/15 text-white/60 hover:border-primary hover:text-primary px-3 py-1.5 transition-colors rounded-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 px-4 py-3 border-t border-white/10 shrink-0"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything…"
                  className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-sm outline-none focus:border-primary/50 placeholder:text-white/25 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <FaPaperPlane size={13} className="text-black" />
                </button>
              </form>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between shrink-0">
                <p className="text-white/20 text-[10px] tracking-widest uppercase">Chandima Kosala</p>
                <a
                  href="https://wa.me/94000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-green-400 transition-colors"
                >
                  <SiWhatsapp size={11} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ── */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="dark-surface fixed bottom-24 right-5 z-[100] w-14 h-14 rounded-xl border border-white/20 bg-black shadow-lg shadow-black/50 flex items-center justify-center"
        aria-label={open ? "Hide assistant" : "Open assistant"}
        title={open ? "Hide assistant" : "Open assistant"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <FaTimes size={18} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <img
                src="/images/assistant-profile.jpg"
                alt="Open Chandima Kosala Assistant"
                className="h-12 w-12 object-contain"
              />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-black/20 bg-white text-black">
                <ChevronUp size={13} />
              </span>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
