import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SaunaBooking } from "@/components/booking/SaunaBooking";

export const metadata: Metadata = {
  title: "Book Swim Only · Water Dip · Willow Garth Country Park",
  description:
    "Book a swim-only cold-water dip at Willow Garth Country Park — no sauna required. Bathing 7am to 7pm, seven days a week, £5 per person.",
  alternates: { canonical: "/book/swim" },
};

export default function BookSwimPage() {
  return (
    <>
      <PageHero
        variant="cinematic"
        eyebrow="Cold-water bathing · Pine Lake"
        title="Swim only"
        accent="booking."
        subtitle="Cold-water dipping without the sauna. Choose any day, pick your hourly arrival time and pay securely — the short health & safety declaration is completed onsite before you enter the water. £5 per person, bathing 7am to 7pm, seven days a week."
        image="/images/sauna-whatsapp.jpeg"
        imageAlt="Natural cold-water dip lake at Willow Garth Country Park"
        imagePosition="center"
        chips={["Plunge Only £5", "Every day 7am–7pm", "Hourly sessions", "Under-16s not permitted"]}
      />
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <SaunaBooking initialTicket="plunge_only" />
        </div>
      </section>
    </>
  );
}
