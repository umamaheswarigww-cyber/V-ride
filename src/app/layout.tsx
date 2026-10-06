import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "V-Ride — Ride together. Pay less.",
  description:
    "V-Ride connects VIT-AP students travelling from Vijayawada and nearby locations. Share a ride, split the fare, and travel together.",
  keywords: [
    "V-Ride",
    "VIT-AP",
    "ride sharing",
    "student carpool",
    "split fare",
    "Vijayawada",
    "share ride",
  ],
  authors: [{ name: "V-Ride Team" }],
  openGraph: {
    title: "V-Ride — Ride together. Pay less.",
    description:
      "Connect with VIT-AP students travelling from Vijayawada and nearby locations. Share a ride and split the fare.",
    siteName: "V-Ride",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "V-Ride — Ride together. Pay less.",
    description:
      "Same route. Same destination. Share the ride. Split the cost. Built for VIT-AP students.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
