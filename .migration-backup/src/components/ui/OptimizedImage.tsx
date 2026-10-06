import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
};

/**
 * Fill-mode optimized image for use inside a positioned, sized container.
 * Mirrors the behaviour of an <img> with object-cover but with Next.js
 * optimization, lazy loading and responsive sizing.
 */
export function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  quality = 75,
}: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      quality={quality}
      className={`object-cover ${className}`}
    />
  );
}
