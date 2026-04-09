"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  X,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

// ---------------------------------------------------------------------------
// Types & Static Data
// ---------------------------------------------------------------------------

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const STATIC_LINKS_START: NavLink[] = [
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "New Arrivals",  href: "/collections/new-arrivals" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "Edit: Spring",  href: "/collections/spring" },
    ],
  },
];

const STATIC_LINKS_END: NavLink[] = [
  { label: "About",   href: "/about" },
  { label: "Sale",    href: "/sale" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NavItem({ link, pathname }: { link: NavLink; pathname: string }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isActive = pathname.startsWith(link.href);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown  = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  return (
    <li className="relative" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
      <Link
        href={link.href}
        onClick={(e) => { if (link.children && link.children.length > 0) e.preventDefault(); }}
        className={`group flex items-center gap-0.5 text-[13px] tracking-[0.12em] uppercase font-medium transition-colors duration-200 ${isActive ? "text-[#B76E79]" : "text-[#1A1A1A] hover:text-[#B76E79]"}`}
      >
        {link.label}
        {link.children && <ChevronDown size={12} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />}
        <span className={`absolute -bottom-1 left-0 h-px bg-[#B76E79] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
      </Link>

      {link.children && dropdownOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-[#F7E7CE] shadow-[0_8px_40px_rgba(26,26,26,0.08)] rounded-sm min-w-[180px] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {link.children.map((child) => (
            <Link key={child.href} href={child.href} className="block px-5 py-2.5 text-[12px] tracking-[0.08em] uppercase text-[#1A1A1A] hover:text-[#B76E79] hover:bg-[#F7E7CE]/40 transition-colors duration-150">
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/search?q=${encodeURIComponent(query.trim())}`); onClose(); }
  };
  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
      <button onClick={onClose} className="absolute top-6 right-6 text-[#1A1A1A] hover:text-[#B76E79]"><X size={22} /></button>
      <p className="text-[11px] tracking-[0.2em] uppercase text-[#B76E79] mb-6">What are you looking for?</p>
      <form onSubmit={handleSearch} className="w-full max-w-xl px-6 relative">
        <input ref={inputRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jewelry, bags…" className="w-full border-0 border-b-2 border-[#1A1A1A] bg-transparent text-[#1A1A1A] text-xl tracking-wide pb-3 pr-10 outline-none focus:border-[#B76E79]" />
        <button type="submit" className="absolute right-8 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#B76E79]"><Search size={18} /></button>
      </form>
    </div>
  );
}

function MobileMenu({ isOpen, onClose, pathname, links }: { isOpen: boolean; onClose: () => void; pathname: string; links: NavLink[]; }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  return (
    <>
      <div className={`fixed inset-0 z-40 bg-[#1A1A1A]/30 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <nav className={`fixed top-0 left-0 h-full w-[80vw] max-w-sm z-50 bg-[#F7E7CE] flex flex-col transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-8 py-7 border-b border-[#1A1A1A]/10">
          <Link href="/" onClick={onClose} className="text-[22px] tracking-[0.3em] font-light text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>ADOROUS</Link>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <ul className="flex-1 overflow-y-auto px-8 py-8 space-y-1">
          {links.map((link, i) => (
            <li key={link.href}>
              {link.children ? (
                <div className="py-3 border-b border-[#1A1A1A]/10">
                  <span className="block text-[13px] tracking-[0.16em] uppercase font-medium text-[#1A1A1A]/50 mb-3">{link.label}</span>
                  <ul className="pl-4 space-y-4">
                    {link.children.map((child) => (
                      <li key={child.href}><Link href={child.href} onClick={onClose} className={`block text-[12px] tracking-[0.12em] uppercase font-medium ${pathname.startsWith(child.href) ? "text-[#B76E79]" : "text-[#1A1A1A]"}`}>{child.label}</Link></li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link href={link.href} onClick={onClose} className={`block py-3 text-[13px] tracking-[0.16em] uppercase font-medium border-b border-[#1A1A1A]/10 ${pathname.startsWith(link.href) ? "text-[#B76E79]" : "text-[#1A1A1A]"}`}>{link.label}</Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Navbar
// ---------------------------------------------------------------------------

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, toggleCart } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([...STATIC_LINKS_START, ...STATIC_LINKS_END]);

  useEffect(() => {
    setIsMounted(true);
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.categories) {
          const dynamicCategories = data.categories.map((cat: any) => ({
            label: cat.name,
            href: `/category/${cat.slug}`,
            children: cat.children?.length > 0 ? cat.children.map((child: any) => ({ label: child.name, href: `/category/${child.slug}` })) : undefined
          }));
          setNavLinks([...STATIC_LINKS_START, ...dynamicCategories, ...STATIC_LINKS_END]);
        }
      } catch (e) { console.error(e); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemCount = isMounted ? totalItems() : 0;

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 
        ${scrolled ? "bg-[#F7E7CE]/95 backdrop-blur-md shadow-sm" : "bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"}`}>
        
        {/* Announcement Bar */}
        <div className={`bg-[#1A1A1A] text-[#F7E7CE] text-[10px] tracking-[0.25em] uppercase text-center transition-all duration-500 flex items-center justify-center 
          ${scrolled ? "h-0 opacity-0" : "h-8 opacity-100"}`}>
          Complimentary shipping over $150
        </div>

        {/* Main Nav - Restructured to 3-Column Layout */}
        <div className={`max-w-[1400px] mx-auto px-4 md:px-10 flex items-center transition-all duration-500 ${scrolled ? "py-3" : "py-5 md:py-8"}`}>
          
          {/* Column 1: Left (Mobile Hamburger / Desktop Nav Space) */}
          <div className="flex-1 flex items-center">
            <button 
              onClick={() => setMobileOpen(true)} 
              className="md:hidden text-[#1A1A1A] p-2 -ml-2 hover:text-[#B76E79] transition-colors"
            >
              <Menu size={22} />
            </button>
            
            {/* Logic for desktop navigation alignment could also go here if needed */}
          </div>

          {/* Column 2: Centre (Logo) */}
          <div className="flex-[2] flex justify-center">
            <Link href="/" className="flex flex-col items-center group transition-transform duration-300">
              <span className="text-[18px] sm:text-[22px] md:text-[28px] tracking-[0.2em] md:tracking-[0.35em] font-light text-[#1A1A1A] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                ADOROUS
              </span>
              <span className="text-[7px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#B76E79] mt-1 font-medium">
                Fashion
              </span>
            </Link>
          </div>

          {/* Column 3: Right (Actions) */}
          <div className="flex-1 flex justify-end items-center gap-1 sm:gap-4 md:gap-6">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-[#1A1A1A] hover:text-[#B76E79] transition-colors">
              <Search size={19} />
            </button>
            <Link href="/account" className="hidden sm:flex p-2 text-[#1A1A1A] hover:text-[#B76E79] transition-colors">
              <User size={19} />
            </Link>
            <button onClick={toggleCart} className="relative p-2 text-[#1A1A1A] hover:text-[#B76E79] transition-colors">
              <ShoppingBag size={19} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-0 min-w-[15px] h-[15px] bg-[#B76E79] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Desktop-Only Centered Navigation (Bottom of Header) */}
        <nav className="hidden md:flex justify-center pb-4">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => <NavItem key={link.href} link={link} pathname={pathname} />)}
          </ul>
        </nav>
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} links={navLinks} />
    </>
  );
}