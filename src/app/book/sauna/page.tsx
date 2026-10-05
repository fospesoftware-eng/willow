import { PageHero } from "@/components/ui/PageHero";
import { SaunaBooking } from "@/components/booking/SaunaBooking";

export const metadata = {
  title: "Book Sauna & Dip",
  description:
    "Book a wood-fired sauna & cold-water dip session at Willow Garth Country Park. Choose your date, complete a health form and pay securely.",
};

export default function BookSaunaPage() {
  return (
    <>
      <PageHero
        variant="cinematic"
        eyebrow="Book now"
        title="Sauna & Dip"
        accent="reservation."
        subtitle="Single sauna & plunge tickets, plunge-only bathing, and weekly or monthly passes. Pick a date, complete the health form and pay securely."
        image="/images/sauna-home.jpg"
        imageAlt="Wood-fired sauna at Willow Garth Country Park"
        chips={["Sauna & Plunge £10", "Plunge £5", "Passes £20/£40", "Bathing 7am–7pm"]}
      />
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <SaunaBooking />
        </div>
      </section>
    </>
  );
}
