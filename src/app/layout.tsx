// Next.js
import type { Metadata } from "next";
import { Inter, Barlow, Geist } from "next/font/google";

// Global css
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Fonts
const interFont = Inter({ subsets: ["latin"] });
const barlowFont = Barlow({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-barlow",
});

// Metadata
export const metadata: Metadata = {
  title: "GoShop | Modern e-commerce",
  description: "Modern e-commerce platform for buying and selling products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${interFont.className} ${barlowFont.variable} `}>
        {children}
      </body>
    </html>
  );
}
