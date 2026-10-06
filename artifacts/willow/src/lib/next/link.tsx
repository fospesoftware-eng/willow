import type { AnchorHTMLAttributes } from "react";
import { Link as WLink } from "wouter";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
};

export default function Link({ href, prefetch: _p, scroll: _s, replace, target, children, ...rest }: Props) {
  const plain = /^(https?:|mailto:|tel:|#|\/\/)/.test(href) || target === "_blank" || /\.[a-z0-9]+$/i.test(href);
  if (plain) {
    return (
      <a href={href} target={target} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <WLink href={href} replace={replace} target={target} {...rest}>
      {children}
    </WLink>
  );
}
