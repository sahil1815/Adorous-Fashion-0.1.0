// components/home/Hero.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#F7E7CE] flex flex-col justify-center">
      <div className="container mx-auto flex h-full flex-col items-center justify-center px-6 pt-[130px] md:pt-[170px] md:flex-row gap-10 md:gap-10 lg:gap-16">
        
        {/* Text Content */}
        <div className="z-10 w-full text-center md:w-1/2 md:text-left animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h1 className="mb-6 text-4xl sm:text-5xl font-light leading-tight text-[#1A1A1A] md:text-7xl lg:text-8xl" style={{ fontFamily: "var(--font-serif)" }}>
            Refined <br /> 
            <span className="italic">Adornments</span>
          </h1>
          <p className="mx-auto mb-8 max-w-md text-sm tracking-wide text-[#1A1A1A]/70 md:mx-0 md:text-base leading-relaxed">
            Handcrafted jewelry and artisanal bags designed for the modern woman who values timeless elegance over fleeting trends.
          </p>
          
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 md:justify-start">
            <Link 
              href="/shop" 
              className="w-full sm:w-auto bg-[#1A1A1A] px-10 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:bg-[#B76E79] text-center"
            >
              Shop Collection
            </Link>
            <Link 
              href="/about" 
              className="w-full sm:w-auto border border-[#1A1A1A]/20 px-10 py-4 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] transition-all hover:border-[#1A1A1A] text-center"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Hero Image Area */}
        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[600px] md:w-1/2">
          <div className="absolute inset-0 bg-[#E5D5BC] overflow-hidden rounded-sm shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000" 
              alt="Luxury Jewelry"
              fill
              className="object-cover mix-blend-multiply opacity-90 transition-transform duration-[2000ms] hover:scale-110"
              priority
            />
          </div>
          
          {/* Decorative element for mobile/tablet depth */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-[#B76E79]/30 hidden sm:block"></div>
        </div>
      </div>
      
      {/* Aesthetic Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="h-[40px] w-[1px] bg-[#1A1A1A]/30"></div>
      </div>
    </section>
  );
}