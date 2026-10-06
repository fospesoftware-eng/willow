import Image from "next/image";

type Props = {
  variant?: "white" | "forest";
  className?: string;
  priority?: boolean;
};

/**
 * Willow Garth heritage badge — weeping willow in an oval.
 * White for photo/dark backgrounds, forest for ivory surfaces.
 */
export function Logo({ variant = "white", className = "", priority = false }: Props) {
  return (
    <Image
      src={variant === "white" ? "/images/logo-white.png" : "/images/logo-forest.png"}
      alt="Willow Garth Country Park & Fishery — official badge"
      width={2070}
      height={1466}
      priority={priority}
      className={`block w-auto object-contain ${className}`}
    />
  );
}
