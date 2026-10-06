import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { NoticeBanner } from "@/components/layout/NoticeBanner";
import { getCachedSettings, getLakes } from "@/lib/store/content";
import { absoluteUrl } from "@/lib/store/pages";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getCachedSettings();
  const og = absoluteUrl(s.seoOgImage);
  return {
    metadataBase: new URL("https://willowgarthcountrypark.co.uk"),
    title: {
      default: s.seoTitle,
      template: "%s · Willow Garth Country Park",
    },
    description: s.seoDescription,
    keywords: [
      "Willow Garth Country Park",
      "country park Doncaster",
      "fishing Doncaster",
      "fishing lakes Doncaster",
      "sauna Doncaster",
      "cold water swimming Doncaster",
      "sauna and dip Doncaster",
      "events Doncaster",
      "Arksey Doncaster",
    ],
    authors: [{ name: "Willow Garth Country Park" }],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: "https://willowgarthcountrypark.co.uk",
      siteName: "Willow Garth Country Park",
      title: s.seoTitle,
      description: s.seoDescription,
      ...(og ? { images: [{ url: og, width: 1200, height: 630, alt: s.seoTitle }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: s.seoTitle,
      description: s.seoDescription,
      ...(og ? { images: [og] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#12231b",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "Willow Garth Country Park",
  description:
    "3 Lake, 6 Acre Complex offering fishing, sauna & dip, camping and events near Doncaster.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Marsh Lane, Arksey",
    addressLocality: "Doncaster",
    postalCode: "DN5 0SH",
    addressCountry: "GB",
  },
  telephone: "+447951138579",
  email: "greenheartdoncaster@gmail.com",
  url: "https://willowgarthcountrypark.co.uk",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, lakes] = await Promise.all([getCachedSettings(), getLakes()]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Grammarly,
          password managers, etc.) inject attributes such as cz-shortcut-listen
          onto <body> before hydration, causing a benign mismatch. */}
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-ivory text-forest-900"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteChrome
          lakes={lakes.map((l) => ({
            name: l.name,
            href: `/lakes/${l.slug}`,
            number: l.number || undefined,
          }))}
          footer={<SiteFooter settings={settings} />}
          notice={<NoticeBanner enabled={settings.noticeEnabled} text={settings.noticeText} />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
