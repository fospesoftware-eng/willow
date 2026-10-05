import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-forest-950 text-ivory px-5">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-sage-400 mb-6">
          404
        </p>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">
          This page has
          <br />
          <span className="italic font-light">wandered off.</span>
        </h1>
        <p className="text-sage-300 mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back to the
          lakes.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.18em] bg-gold text-forest-950 hover:bg-gold-light transition-colors"
        >
          Return Home →
        </Link>
      </div>
    </section>
  );
}
