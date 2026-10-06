import Link from "@/lib/next/link";

export default function CancelledPage() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-xl px-5 text-center md:px-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest-900 text-3xl text-ivory">
          ←
        </div>
        <h1 className="mt-8 font-display text-4xl font-extrabold uppercase text-forest-900 md:text-5xl">
          Payment not completed
        </h1>
        <p className="mt-4 text-forest-700/80">
          You didn't finish the payment, so no booking was made. No charge has
          been taken. Would you like to try again?
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/book/sauna"
            className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-forest-700"
          >
            Try again →
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-forest-900/25 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-forest-900 hover:bg-forest-900 hover:text-ivory"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
