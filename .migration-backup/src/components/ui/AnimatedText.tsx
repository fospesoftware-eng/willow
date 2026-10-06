"use client";

import { motion } from "framer-motion";
import { staggerFast, wordReveal } from "@/lib/animations";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

export function AnimatedText({ text, className, as = "h2" }: Props) {
  const words = text.split(" ");
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={staggerFast}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            variants={wordReveal}
            className="inline-block"
            style={{ willChange: "transform" }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
