import { Reveal } from "./Reveal";
import { staggerFast, wordReveal } from "@/lib/animations";
import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: Props) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  const words = title.split(" ");

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow && (
        <Reveal className="mb-6">
          <span
            className={`inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] ${
              light ? "text-sage-300" : "text-forest-600"
            }`}
          >
            <span className="h-px w-8 bg-current" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <motion.h2
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className={`font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight ${
          light ? "text-ivory" : "text-forest-900"
        }`}
      >
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span variants={wordReveal} className="inline-block">
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      {description && (
        <Reveal delay={0.2}>
          <p
            className={`mt-6 text-lg leading-relaxed max-w-2xl ${
              light ? "text-sage-200" : "text-forest-700/80"
            } ${align === "center" ? "mx-auto" : ""}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
