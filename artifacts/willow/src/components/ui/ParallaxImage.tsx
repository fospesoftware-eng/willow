"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { OptimizedImage } from "./OptimizedImage";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  speed?: number;
  priority?: boolean;
};

export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  speed = 0.2,
  priority = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const offset = `${Math.round(speed * 40)}%`;
  const y = useTransform(scrollYProgress, [0, 1], [`-${offset}`, offset]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y, scale: 1.15 }}
        className={`absolute inset-0 ${imgClassName}`}
      >
        <OptimizedImage src={src} alt={alt} priority={priority} />
      </motion.div>
    </div>
  );
}
