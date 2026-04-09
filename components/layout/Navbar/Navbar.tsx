"use client";

/**
 * Navbar.tsx
 *
 * Features:
 * - Transparent on page top → solid Champagne Silk on scroll
 * - Animated underline hover on nav links
 * - Cart icon with live item-count badge (Zustand)
 * - Mobile slide-in menu with staggered link animation
 * - Search overlay (Fully wired to /search page)
 * - Hide-on-scroll Announcement Bar
 * - Fully accessible: aria labels, keyboard-navigable, focus-trap
 * - Dynamic Categories fetched directly from MongoDB
 */

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
// Types
// ---------------------------------------------------------------------------

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

// ---------------------------------------------------------------------------
// Data — Static boundaries (Dynamic categories go in the middle)
// ---------------------------------------------------------------------------

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

/** Animated underline that slides in on hover / active route */
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
    <li
      className="relative"
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
    >
      <Link
        href={link.href}
        // FIX: Prevent click if it's a dropdown parent to avoid 404 errors!
        onClick={(e) => {
          if (link.children && link.children.length > 0) {
            e.preventDefault();
          }
        }}
        className={`
          group flex items-center gap-0.5 text-[13px] tracking-[0.12em] uppercase
          font-medium transition-colors duration-200
          ${isActive ? "text-[#B76E79]" : "text-[#1A1A1A] hover:text-[#B76E79]"}
        `}
        aria-current={isActive ? "page" : undefined}
      >
        {link.label}
        {link.children && (
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          />
        )}
        {/* Animated underline */}
        <span
          className={`
            absolute -bottom-1 left-0 h-px bg-[#B76E79]
            transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}
        />
      </Link>

      {/* Dropdown */}
      {link.children && dropdownOpen && (
        <div
          className="
            absolute top-full left-1/2 -translate-x-1/2 mt-3
            bg-white border border-[#F7E7CE] shadow-[0_8px_40px_rgba(26,26,26,0.08)]
            rounded-sm min-w-[180px] py-2 z-50
            animate-in fade-in slide-in-from-top-2 duration-150
          "
          onMouseEnter={openDropdown}
          onMouseLeave={closeDropdown}
        >
          {link.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="
                block px-5 py-2.5 text-[12px] tracking-[0.08em] uppercase
                text-[#1A1A1A] hover:text-[#B76E79] hover:bg-[#F7E7CE]/40
                transition-colors duration-150
              "
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

/** Search overlay */
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Wire up the search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose(); // Close the overlay after searching
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm
        flex flex-col items-center justify-center
        animate-in fade-in duration-200
      "
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#1A1A1A] hover:text-[#B76E79] transition-colors"
        aria-label="Close search"
      >
        <X size={22} />
      </button>

      <p className="text-[11px] tracking-[0.2em] uppercase text-[#B76E79] mb-6">
        What are you looking for?
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-xl px-6 relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jewelry, bags…"
          className="
            w-full border-0 border-b-2 border-[#1A1A1A] bg-transparent
            text-[#1A1A1A] text-xl tracking-wide pb-3 pr-10
            placeholder:text-[#1A1A1A]/30 outline-none
            focus:border-[#B76E79] transition-colors duration-300
          "
        />
        <button 
          type="submit"
          aria-label="Submit search"
          className="absolute right-8 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#B76E79] transition-colors"
        >
          <Search size={18} />
        </button>
      </form>

      <p className="mt-6 text-[11px] tracking-[0.15em] text-[#1A1A1A]/40">
        Press ESC to close
      </p>
    </div>
  );
}

/** Mobile slide-in menu */
function MobileMenu({
  isOpen,
  onClose,
  pathname,
  links, 
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  links: NavLink[]; 
}) {
  // Trap focus + close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-[#1A1A1A]/30 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-[80vw] max-w-sm z-50
          bg-[#F7E7CE] flex flex-col
          transition-transform duration-400 ease-[cubic-bezier(0.32,0,0.15,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-[#1A1A1A]/10">
          <Link
            href="/"
            onClick={onClose}
            className="text-[22px] tracking-[0.3em] font-light text-[#1A1A1A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            ADOROUS
          </Link>
          <button
            onClick={onClose}
            className="text-[#1A1A1A] hover:text-[#B76E79] transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <ul className="flex-1 overflow-y-auto px-8 py-8 space-y-1">
          {links.map((link, i) => (
            <li key={link.href}>
              {/* FIX: Mobile menu now correctly maps nested dropdown items */}
              {link.children && link.children.length > 0 ? (
                <div
                  className={`
                    py-3 border-b border-[#1A1A1A]/10
                    transition-all duration-300
                    ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}
                  `}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="block text-[13px] tracking-[0.16em] uppercase font-medium text-[#1A1A1A]/50 mb-3">
                    {link.label}
                  </span>
                  <ul className="pl-4 space-y-4">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className={`
                            block text-[12px] tracking-[0.12em] uppercase font-medium
                            ${pathname.startsWith(child.href) ? "text-[#B76E79]" : "text-[#1A1A1A] hover:text-[#B76E79]"}
                          `}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`
                    block py-3 text-[13px] tracking-[0.16em] uppercase font-medium
                    border-b border-[#1A1A1A]/10
                    transition-all duration-300
                    ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}
                    ${pathname.startsWith(link.href) ? "text-[#B76E79]" : "text-[#1A1A1A]"}
                  `}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-[#1A1A1A]/10 space-y-3">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-3 text-[12px] tracking-[0.12em] uppercase text-[#1A1A1A]/70 hover:text-[#B76E79] transition-colors"
          >
            <User size={16} /> My Account
          </Link>
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 text-[12px] tracking-[0.12em] uppercase text-[#1A1A1A]/70 hover:text-[#B76E79] transition-colors"
          >
            <Heart size={16} /> Wishlist
          </Link>
        </div>
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

  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [isMounted, setIsMounted]     = useState(false);

  // State to hold our fully built navigation links
  const [navLinks, setNavLinks] = useState<NavLink[]>([...STATIC_LINKS_START, ...STATIC_LINKS_END]);

  // Fetch live categories from MongoDB on mount
  useEffect(() => {
    setIsMounted(true);

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        
        if (data.categories) {
          // Transform database categories into the format our Navbar expects
          const dynamicCategories: NavLink[] = data.categories.map((cat: any) => ({
            label: cat.name,
            href: `/category/${cat.slug}`,
            // If the category has children, map those too!
            children: cat.children && cat.children.length > 0 
              ? cat.children.map((child: any) => ({
                  label: child.name,
                  href: `/category/${child.slug}`
                }))
              : undefined
          }));

          // Sandwich the dynamic categories between the static start and end links
          setNavLinks([...STATIC_LINKS_START, ...dynamicCategories, ...STATIC_LINKS_END]);
        }
      } catch (error) {
        console.error("Failed to load navbar categories", error);
      }
    };

    fetchCategories();
  }, []);

  // Detect scroll to switch navbar appearance
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set initial state
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const itemCount = totalItems();
  
  // Safely fallback to 0 until the component mounts to match the server HTML
  const displayCount = isMounted ? itemCount : 0; 
  
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header
        className={`
          fixed top-0 inset-x-0 z-30 flex flex-col
          transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${scrolled
            ? "bg-[#F7E7CE]/95 backdrop-blur-md shadow-[0_1px_0_rgba(26,26,26,0.08)]"
            : "bg-transparent"}
        `}
      >
        {/* ── Announcement bar ── */}
        <div
          className={`
            bg-[#1A1A1A] text-[#F7E7CE]
            text-[10px] tracking-[0.25em] uppercase text-center
            transition-all duration-500 overflow-hidden
            flex items-center justify-center
            ${scrolled ? "h-0 opacity-0" : "h-8 opacity-100"}
          `}
        >
          <span className="hidden sm:inline">Complimentary shipping on orders over $150 &nbsp;·&nbsp; Free returns</span>
          <span className="sm:hidden">Free shipping over $150</span>
        </div>

        {/* ── Main Nav Area ── */}
        <div className={`transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">

            {/* ── Left: Mobile hamburger ──────────────────────── */}
            <button
              className="md:hidden text-[#1A1A1A] hover:text-[#B76E79] transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            {/* ── Centre-left: Logo ───────────────────────────── */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex flex-col items-center md:items-start"
              aria-label="Adorous Fashion — home"
            >
              <span
                className="text-[26px] md:text-[28px] tracking-[0.35em] font-light text-[#1A1A1A] leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ADOROUS
              </span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-[#B76E79] mt-0.5 font-medium">
                Fashion
              </span>
            </Link>

            {/* ── Centre: Desktop nav links ───────────────────── */}
            <nav className="hidden md:flex" aria-label="Main navigation">
              <ul className="flex items-center gap-8">
                {/* Dynamically map the navLinks state */}
                {navLinks.map((link) => (
                  <NavItem key={link.href} link={link} pathname={pathname} />
                ))}
              </ul>
            </nav>

            {/* ── Right: Icon actions ─────────────────────────── */}
            <div className="flex items-center gap-5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-[#1A1A1A] hover:text-[#B76E79] transition-colors duration-200"
                aria-label="Open search"
              >
                <Search size={19} />
              </button>

              {/* Wishlist — hidden on small screens */}
              <Link
                href="/wishlist"
                className="hidden sm:block text-[#1A1A1A] hover:text-[#B76E79] transition-colors duration-200"
                aria-label="Wishlist"
              >
                <Heart size={19} />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:block text-[#1A1A1A] hover:text-[#B76E79] transition-colors duration-200"
                aria-label="My account"
              >
                <User size={19} />
              </Link>

              {/* Cart — with safely mounted count badge */}
              <button
                onClick={toggleCart}
                className="relative text-[#1A1A1A] hover:text-[#B76E79] transition-colors duration-200"
                aria-label={`Shopping bag — ${displayCount} ${displayCount === 1 ? "item" : "items"}`}
              >
                <ShoppingBag size={19} />
                {isMounted && itemCount > 0 && (
                  <span
                    className="
                      absolute -top-2 -right-2
                      min-w-[17px] h-[17px] px-0.5
                      bg-[#B76E79] text-white text-[10px] font-semibold
                      rounded-full flex items-center justify-center
                      leading-none
                      animate-in zoom-in-50 duration-150
                    "
                    aria-hidden="true"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileOpen} 
        onClose={closeMobile} 
        pathname={pathname} 
        links={navLinks} /* Passed down so the mobile menu matches */
      />
    </>
  );
}