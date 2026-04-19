import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SleepStream",
  description: "Automate your ads revenue with bots. ",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="richads-script"
          src="https://richinfo.co/richpartners/pops/js/richads-pu-ob.js"
          data-pubid="1008816"
          data-siteid="394383"
          data-cfasync="false"
          strategy="afterInteractive" // Loads right after the page becomes interactive
        />
        {/* <script src="https://richinfo.co/richpartners/pops/js/richads-pu-ob.js" data-pubid="1008816" data-siteid="394383" async data-cfasync="false"></script> */}
        {children}
      </body>
    </html>
  );
}
