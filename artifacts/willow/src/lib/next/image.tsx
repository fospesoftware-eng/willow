import type { CSSProperties, ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  objectFit?: CSSProperties["objectFit"];
};

export default function Image({ fill, priority, quality: _q, objectFit, style, src, alt, sizes: _s, loading, ...rest }: Props) {
  const st: CSSProperties = {
    ...(fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : {}),
    ...(objectFit ? { objectFit } : {}),
    ...style,
  };
  return <img src={src} alt={alt} loading={priority ? "eager" : loading ?? "lazy"} style={st} {...rest} />;
}
