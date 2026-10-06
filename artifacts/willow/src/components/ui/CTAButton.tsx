"use client";

import Link from "@/lib/next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  external?: boolean;
  className?: string;
  onClick?: () => void;
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  external,
  className = "",
  onClick,
}: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const rotate = useTransform([sx, sy], ([latestX, latestY]) => {
    const r = (latestX as number) * 0.15;
    return r;
  });

  const base =
    "relative inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 overflow-hidden group rounded-full";
  const styles = {
    primary:
      "bg-forest-800 text-ivory hover:bg-forest-700 border border-forest-800",
    outline:
      "border border-foreground/30 text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
    ghost: "text-foreground hover:text-forest-600",
  }[variant];

  const content = (
    <>
      <motion.span
        style={{ x: sx, y: sy, rotate }}
        className="relative z-10 inline-flex items-center gap-2"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - rect.left - rect.width / 2);
          y.set(e.clientY - rect.top - rect.height / 2);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        {children}
        <span className="transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
      </motion.span>
    </>
  );

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        className={`${base} ${styles} ${className}`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.97 }} className={`inline-flex ${className}`}>
      <Link href={href} className={`${base} ${styles}`} onClick={onClick}>
        {content}
      </Link>
    </motion.div>
  );
}
