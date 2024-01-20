import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Toaster from "./toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Waterloti - Explore Open Source Like Never Before",
  metadataBase: new URL('https://waterloti.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    images: '/opengraph-image.png',
  },
  description:
    "Just upload your resume and let's find you some cool open source projects that fit your style. No resume? No sweat. Check out hot GitHub projects directly.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" />
      </body>
      <Analytics />
    </html>
  );
}
