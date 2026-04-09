import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";

// Note: Added 'async' here so we can await the user session
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  
  // --- SECURITY GUARD ---
  const user = await getCurrentUser();

  // If no user is logged in, send them to login
  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  // If they are logged in but NOT an admin, send them to the storefront
  if (user.role !== "admin") {
    redirect("/"); 
  }
  // ----------------------

  // If they pass the checks, render your beautiful layout!
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-xl tracking-[0.2em] font-light" style={{ fontFamily: "var(--font-serif)" }}>
            ADOROUS <span className="text-[10px] uppercase tracking-widest text-[#B76E79] block mt-1">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 text-sm tracking-wide">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-white/10 transition-colors">
            <LayoutDashboard size={18} className="text-[#B76E79]" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-white/10 transition-colors">
            <Package size={18} className="text-[#B76E79]" />
            <span>Products</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-white/10 transition-colors">
            <ShoppingCart size={18} className="text-[#B76E79]" />
            <span>Orders</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-[#F7E7CE]/70 hover:text-white transition-colors text-sm">
            <LogOut size={18} />
            <span>Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}