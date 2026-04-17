// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Gem, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "About Us & Our Story | Adorous Fashion",
  description:
    "Discover the journey, craftsmanship, and vision behind Adorous Fashion.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-32 md:pt-40 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* ── 1. The Story Header ───────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#B76E79] mb-4 font-medium">
            The Beginning
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1A1A1A] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Our Story & Vision
          </h1>
        </div>

        {/* ── 2. The Narrative ──────────────────────────────────────────── */}
        <article className="prose prose-sm md:prose-base max-w-2xl mx-auto text-[#1A1A1A]/75 leading-loose tracking-wide mb-24 md:mb-32">
          {/* ✅ FIXED: Moved the font-serif into the first-letter Tailwind class and removed the invalid style prop */}
          <p className="first-letter:text-5xl first-letter:font-light first-letter:text-[#1A1A1A] first-letter:mr-3 first-letter:float-left first-letter:font-serif">
            Adorous Fashion started with a simple observation: finding
            high-quality, beautifully designed fashion jewelry and bags in
            Bangladesh often meant compromising on either price or aesthetic. We
            wanted to bridge that gap.
          </p>

          <p className="mt-6">
            Our journey began by sourcing just a few key pieces—timeless
            necklaces, elegant earrings, and structured bags that we personally
            loved. We wanted items that felt luxurious to the touch, pieces you
            could wear to a gala or simply to elevate a daily outfit.
          </p>

          <blockquote
            className="my-12 border-l-0 text-center italic text-[#1A1A1A] text-2xl md:text-3xl font-light leading-snug px-4 md:px-10"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &quot;Fashion fades, but true elegance is a reflection of how you
            choose to express yourself every single day.&quot;
          </blockquote>

          <p>
            As our collection grew, so did our community. Today, Adorous is more
            than just a store; it is a destination for individuals who
            appreciate the finer details. We spend countless hours curating the
            perfect items so that when you unbox an Adorous package, you feel
            that unmistakable sense of premium quality.
          </p>
        </article>

        {/* ── 3. Image & Philosophy Split ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-32">
          <div className="relative aspect-[4/5] bg-[#F7E7CE]/30 w-full overflow-hidden">
            <Image
              src="https://ik.imagekit.io/adorousfashion/IMG_5825.HEIC?updatedAt=1775814170351&tr=f-auto,w-800,q-80"
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
              Elegance in Every Detail
            </h2>
            <p className="text-[#1A1A1A]/70 tracking-wide leading-relaxed text-sm">
              We curate collections that transcend fleeting trends. Whether it
              is a delicately crafted necklace or a perfectly structured bag,
              every item in our store is selected to be a staple in your
              wardrobe for years to come.
            </p>
            <p className="text-[#1A1A1A]/70 tracking-wide leading-relaxed text-sm">
              Our focus remains relentlessly on quality. We partner with expert
              artisans to ensure that the materials, the finish, and the
              durability of our products meet the highest standards of the
              industry.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]">
                With Love,
              </p>
              <p
                className="text-2xl text-[#B76E79]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                The Adorous Team
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. Value Pillars ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center border-t border-[#1A1A1A]/10 pt-20">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#F7E7CE]/40 rounded-full flex items-center justify-center text-[#B76E79] mb-6">
              <Gem size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#1A1A1A] mb-3">
              Premium Quality
            </h3>
            <p className="text-[#1A1A1A]/60 text-sm leading-relaxed max-w-[250px]">
              Sourced globally and crafted with precision to ensure lasting
              beauty.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#F7E7CE]/40 rounded-full flex items-center justify-center text-[#B76E79] mb-6">
              <HeartHandshake size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#1A1A1A] mb-3">
              Curated Design
            </h3>
            <p className="text-[#1A1A1A]/60 text-sm leading-relaxed max-w-[250px]">
              Every piece is hand-selected to guarantee a timeless, modern
              aesthetic.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#F7E7CE]/40 rounded-full flex items-center justify-center text-[#B76E79] mb-6">
              <ShieldCheck size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#1A1A1A] mb-3">
              Customer First
            </h3>
            <p className="text-[#1A1A1A]/60 text-sm leading-relaxed max-w-[250px]">
              A seamless shopping experience, from complimentary shipping to
              easy exchanges.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
