"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

/** Pages whose hero sits on a light background — header must stay legible at the top. */
const LIGHT_TOP_PATHS = ["/lakes", "/privacy", "/terms", "/cookies"];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lightTop = LIGHT_TOP_PATHS.includes(pathname);
  const solid = scrolled || lightTop;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 pt-4 md:pt-5">
          <div
            className={`flex items-center justify-between gap-4 rounded-full pl-2.5 pr-2 py-1.5 transition-all duration-500 ${
              solid
                ? "bg-ivory/90 backdrop-blur-xl border border-forest-900/10 shadow-pill"
                : "bg-transparent border border-transparent"
            }`}
          >
            {/* Logo badge */}
            <Link
              href="/"
              aria-label="Willow Garth Country Park — home"
              className="shrink-0 rounded-full transition-transform duration-500 hover:scale-105"
            >
              <Logo
                variant={solid ? "forest" : "white"}
                priority
                className="h-16 md:h-20"
              />
            </Link>

            {/* Center floating pill */}
            <nav
              className={`hidden lg:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 ${
                solid
                  ? "bg-transparent border border-transparent"
                  : "bg-ivory/15 backdrop-blur-md border border-ivory/25"
              }`}
            >
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all duration-300 hover:bg-forest-900 hover:text-ivory ${
                    solid ? "text-forest-800" : "text-ivory"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-3">
              <Link
                href="/book"
                className="hidden lg:inline-flex items-center gap-2 rounded-full bg-forest-900 text-ivory pl-5 pr-2 py-2 text-[12px] font-semibold tracking-wide hover:bg-forest-700 transition-colors duration-300 shadow-pill"
              >
                Book Now
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gold text-forest-950">
                  →
                </span>
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className={`lg:hidden flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md transition-colors ${
                  solid
                    ? "bg-forest-900 text-ivory"
                    : "bg-ivory/20 text-ivory border border-ivory/30"
                }`}
              >
                <span className="flex flex-col gap-[5px]">
                  <span className="block w-5 h-px bg-current" />
                  <span className="block w-5 h-px bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-forest-950 lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 pt-6">
              <Logo variant="white" className="h-14" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-ivory/30 text-ivory"
              >
                <span className="relative block w-5 h-5">
                  <span className="absolute top-1/2 left-0 block w-5 h-px bg-current rotate-45" />
                  <span className="absolute top-1/2 left-0 block w-5 h-px bg-current -rotate-45" />
                </span>
              </button>
            </div>
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              className="flex flex-col px-6 mt-10 gap-1"
            >
              {nav.map((item) => (
                <motion.div
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-4xl font-extrabold text-ivory border-b border-ivory/10"
                  >
                    {item.label}
                    <span className="text-gold">→</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="mt-10"
              >
                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-gold text-forest-950 py-4 text-sm font-semibold uppercase tracking-[0.18em]"
                >
                  Book Your Experience
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
