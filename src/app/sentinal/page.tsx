import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SentinelEmbed } from "@/components/safety/SentinelEmbed";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sentinel Safety Screening · Willow Garth Country Park",
  description:
    "Complete the short Sentinel health and safety screening before your sauna & cold plunge session at Willow Garth Country Park, Doncaster.",
  alternates: { canonical: "/sentinal" },
};

export default function SentinalPage() {
  return (
    <>
      <PageHero
        variant="cinematic"
        image="/images/sauna-home.jpg"
        imageAlt="Wood-fired sauna and cold plunge lake at Willow Garth Country Park"
        imagePosition="center"
        eyebrow="Sauna & Cold Plunge · Safety Steps"
        title="Safety screening"
        accent="before you book"
        subtitle="Please complete our safety steps before booking. The short Sentinel screening takes about 60 seconds and helps you prepare for the sauna and cold-water plunge."
        chips={["Takes ~60 seconds", "Mandatory for all users", "Under-16s not permitted"]}
      />

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <Reveal>
            <div className="mb-8 rounded-[1.75rem] border border-gold/30 bg-gold/[0.06] p-6 md:p-8">
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-forest-900 md:text-3xl">
                Pine Lake Sauna &amp; Cold Plunge
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-forest-800 md:text-base">
                This short Sentinel Screening Tool helps identify factors that may influence
                your response to cold, heat or contrast exposure. It is not a diagnosis and
                does not replace medical advice. You are responsible for sharing accurate
                information about your health conditions, symptoms, medications and tolerance.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-forest-800 md:text-base">
                This screening is separate to Willow Garth Country Park&apos;s terms, conditions,
                rules and regulations — you must read and agree to those separately before taking
                part in any activities. This is guidance only based on your answers: listen to
                your body, and if anything doesn&apos;t feel right, stop immediately and seek
                appropriate attention and support.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SentinelEmbed />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-forest-950 p-8 text-ivory md:flex-row md:items-center">
              <div>
                <h3 className="font-display text-xl font-extrabold uppercase tracking-tight">
                  Green light? Continue to booking
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-sage-200">
                  Once your screening is complete, choose your sauna &amp; plunge session or
                  plunge-only visit. Tickets from £5, bathing 7am–7pm, sauna lit Thursday,
                  Saturday and Sunday.
                </p>
              </div>
              <Link
                href="/book/sauna"
                className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-gold py-3 pl-7 pr-2 text-sm font-bold uppercase tracking-[0.12em] text-forest-950 transition hover:bg-gold-light"
              >
                Book your session
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-900 text-ivory transition-transform duration-500 group-hover:rotate-45">
                  →
                </span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 text-center text-xs leading-relaxed text-forest-600">
              The screening is processed by our partner{" "}
              <a
                href="https://sentinel.breatheolution.com/willowgarthcountrypark"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-forest-800 underline underline-offset-2 hover:text-gold"
              >
                Sentinel (Breatheolution)
              </a>{" "}
              under their own privacy policy. Read our full{" "}
              <Link
                href="/health-safety"
                className="font-semibold text-forest-800 underline underline-offset-2 hover:text-gold"
              >
                health &amp; safety guidance
              </Link>{" "}
              before your visit.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
