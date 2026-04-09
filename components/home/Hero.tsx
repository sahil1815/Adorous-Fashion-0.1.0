import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-[#F7E7CE]">
      <div className="container mx-auto flex h-full flex-col items-center justify-center px-6 md:flex-row">
        {/* Text Content */}
        <div className="z-10 w-full text-center md:w-1/2 md:text-left">
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.4em] text-[#B76E79]">
            Est. 2026 — Adorous
          </p>
          <h1 className="mb-6 text-5xl font-light leading-tight text-[#1A1A1A] md:text-7xl lg:text-8xl">
            Refined <br /> 
            <span className="italic">Adornments</span>
          </h1>
          <p className="mx-auto mb-8 max-w-md text-sm tracking-wide text-[#1A1A1A]/70 md:mx-0 md:text-base">
            Handcrafted jewelry and artisanal bags designed for the modern woman who values timeless elegance over fleeting trends.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 md:justify-start">
            <Link 
              href="/shop" 
              className="bg-[#1A1A1A] px-10 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:bg-[#B76E79]"
            >
              Shop Collection
            </Link>
            <Link 
              href="/about" 
              className="border border-[#1A1A1A]/20 px-10 py-4 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] transition-all hover:border-[#1A1A1A]"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Hero Image Area */}
        <div className="relative mt-12 h-[400px] w-full md:mt-0 md:h-[600px] md:w-1/2">
          <div className="absolute inset-0 bg-[#E5D5BC] transition-transform duration-700 hover:scale-105">
            <Image 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000" 
              alt="Luxury Jewelry"
              fill
              className="object-cover mix-blend-multiply opacity-80"
              priority
            />
          </div>
        </div>
      </div>
      
      {/* Aesthetic Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-[40px] w-[1px] bg-[#1A1A1A]/30"></div>
      </div>
    </section>
  );
}