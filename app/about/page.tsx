// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Gem, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "About Us | Adorous Fashion",
  description: "Discover the ethos, craftsmanship, and vision behind Adorous Fashion.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-32 md:pt-40 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#B76E79] mb-4 font-medium">
            The Brand
          </p>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1A1A1A] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Elegance in Every Detail
          </h1>
          <p className="text-[#1A1A1A]/60 tracking-wide leading-relaxed text-sm md:text-base">
            Adorous Fashion was born from a desire to bring premium, timeless accessories to the modern woman. 
            We believe that luxury isn't just about a price tag; it is about craftsmanship, aesthetic, and how a piece makes you feel.
          </p>
        </div>

        {/* Image & Text Split Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-32">
          <div className="relative aspect-[4/5] bg-[#F7E7CE]/30 w-full overflow-hidden">
            {/* Replace /placeholder.jpg with an actual image of your jewelry or a model later */}
            <Image 
              src="/placeholder.jpg" 
              alt="Adorous craftsmanship" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 
              className="text-3xl font-light text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Our Philosophy
            </h2>
            <p className="text-[#1A1A1A]/65 tracking-wide leading-relaxed text-sm">
              We curate collections that transcend fleeting trends. Whether it is a delicately crafted necklace 
              or a perfectly structured bag, every item in our store is selected to be a staple in your wardrobe for years to come.
            </p>
            <p className="text-[#1A1A1A]/65 tracking-wide leading-relaxed text-sm">
              Our focus remains relentlessly on quality. We partner with expert artisans to ensure that the materials, 
              the finish, and the durability of our products meet the highest standards of the industry.
            </p>
            <div className="pt-4">
              <Link 
                href="/shop" 
                className="inline-block border-b border-[#1A1A1A] pb-1 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#B76E79] hover:border-[#B76E79] transition-colors"
              >
                Explore the Collection
              </Link>
            </div>
          </div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center border-t border-[#1A1A1A]/10 pt-20">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#F7E7CE]/40 rounded-full flex items-center justify-center text-[#B76E79] mb-6">
              <Gem size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#1A1A1A] mb-3">Premium Quality</h3>
            <p className="text-[#1A1A1A]/60 text-sm leading-relaxed max-w-[250px]">
              Sourced globally and crafted with precision to ensure lasting beauty.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#F7E7CE]/40 rounded-full flex items-center justify-center text-[#B76E79] mb-6">
              <HeartHandshake size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#1A1A1A] mb-3">Curated Design</h3>
            <p className="text-[#1A1A1A]/60 text-sm leading-relaxed max-w-[250px]">
              Every piece is hand-selected to guarantee a timeless, modern aesthetic.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#F7E7CE]/40 rounded-full flex items-center justify-center text-[#B76E79] mb-6">
              <ShieldCheck size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#1A1A1A] mb-3">Customer First</h3>
            <p className="text-[#1A1A1A]/60 text-sm leading-relaxed max-w-[250px]">
              A seamless shopping experience, from complimentary shipping to easy exchanges.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}