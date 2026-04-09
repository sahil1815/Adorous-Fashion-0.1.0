import type { Metadata } from "next";
import { Jost, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Import our new smart wrapper
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const jost = Jost({ 
  subsets: ["latin"],
  variable: "--font-sans" 
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "Adorous | Fine Jewelry & Bags",
  description: "Minimalist, elegant, high-end women's accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jost.variable} ${cormorant.variable}`}>
      <body className="bg-white font-sans text-[#1A1A1A] antialiased selection:bg-[#B76E79]/30">
        
        {/* The wrapper decides what UI to show based on the URL */}
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        
      </body>
    </html>
  );
}