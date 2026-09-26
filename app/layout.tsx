import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macon Wayfinder — help with rent, utilities & benefits",
  description: "A clear next-step guide to verified Macon-area rent and utility assistance, SNAP application help, and Georgia benefits resources.",
  applicationName: "Macon Wayfinder",
  referrer: "no-referrer",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0d2927" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
