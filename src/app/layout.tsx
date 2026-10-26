import type { Metadata } from "next";
import localFont from "next/font/local";
import { BookingProvider } from "@/components/booking";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const display = localFont({ src: "../assets/fonts/cormorant.woff2", variable: "--font-display", display: "swap" });
const sans = localFont({ src: "../assets/fonts/manrope.woff2", variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Meridian Drive Hotel | A little escape. A lasting feeling.",
  description: "Discover the Meridian Drive Hotel website concept: welcoming rooms, tropical inspiration, and a calmer kind of stay.",
  robots: { index: false, follow: false },
  openGraph: { title: "Meridian Drive Hotel", description: "A little escape. A lasting feeling. Explore our hotel website design preview.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${display.variable} ${sans.variable}`}><body><a className="skip-link" href="#main-content">Skip to content</a><BookingProvider><SiteHeader />{children}<SiteFooter /></BookingProvider></body></html>;
}
