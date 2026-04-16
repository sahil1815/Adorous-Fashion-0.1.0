import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; 
import ProfileClient from "./ProfileClient"; 
import { ShoppingBag, LogOut, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/login");
  }

  await connectDB();
  const userId = sessionUser.id; 

  const dbUser = await User.findById(userId).lean();
  const orders = await Order.find({
    $or: [{ user: userId }, { guestEmail: sessionUser.email }]
  })
    .sort({ createdAt: -1 })
    .lean();

  // Get user's initials for the Avatar
  const initial = dbUser?.name?.charAt(0).toUpperCase() || sessionUser.name?.charAt(0).toUpperCase() || "U";

  return (
    // Clean, bright, soft background color
    <main className="min-h-screen bg-[#FCFBFA] pt-32 md:pt-50 pb-24 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LEFT SIDEBAR: User Profile & Navigation */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
            
            <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              {/* Avatar Circle */}
              <div className="w-24 h-24 rounded-full bg-[#F7E7CE]/40 text-[#B76E79] flex items-center justify-center text-3xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                {initial}
              </div>
              <h2 className="text-xl font-medium text-[#1A1A1A] mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                {dbUser?.name || sessionUser.name}
              </h2>
              <p className="text-xs text-gray-500 mb-8 truncate w-full px-2">
                {dbUser?.email || sessionUser.email}
              </p>

              <div className="w-full h-px bg-gray-100 mb-6"></div>

              {/* Navigation Links */}
              <div className="w-full space-y-3">
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#F7E7CE]/30 px-4 py-3.5 text-[11px] uppercase tracking-wider font-semibold text-[#B76E79] transition hover:bg-[#F7E7CE]/60"
                >
                  <ShoppingBag size={14} />
                  Continue shopping
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[11px] uppercase tracking-wider font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </form>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Main Content */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-8">
            
            {/* 1. Personal Information Component */}
            <ProfileClient user={{
              name: dbUser?.name,
              email: dbUser?.email,
              phone: dbUser?.phone 
            }} />

            {/* 2. Order History Box */}
            <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-8">
                <Package className="text-gray-400" size={20} />
                <h3 className="text-xl font-medium text-[#1A1A1A]" style={{ fontFamily: "var(--font-serif)" }}>
                  Order History
                </h3>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-2xl">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <ShoppingBag className="text-gray-300" size={24} />
                  </div>
                  <p className="text-gray-500 mb-6 text-sm">You haven't placed any orders yet.</p>
                  <Link
                    href="/shop"
                    className="inline-block bg-[#1A1A1A] text-white uppercase tracking-wider text-[11px] font-semibold px-8 py-3 hover:bg-[#B76E79] transition-colors rounded-full"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="pb-4 font-semibold px-2">Order ID</th>
                        <th className="pb-4 font-semibold px-2">Date</th>
                        <th className="pb-4 font-semibold px-2">Status</th>
                        <th className="pb-4 font-semibold text-right px-2">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order: any) => {
                        const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        });
                        const currentStatus = order.status || "pending";
                        
                        return (
                          <tr key={order._id.toString()} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-5 font-medium text-[#1A1A1A] px-2">{order.orderNumber}</td>
                            <td className="py-5 text-gray-500 px-2">{date}</td>
                            <td className="py-5 px-2">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider
                                ${currentStatus === 'pending' || currentStatus === 'paid' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : ''}
                                ${currentStatus === 'processing' ? 'bg-orange-50 text-orange-700 border border-orange-100' : ''}
                                ${currentStatus === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''}
                                ${currentStatus === 'delivered' ? 'bg-green-50 text-green-700 border border-green-100' : ''}
                                ${currentStatus === 'cancelled' || currentStatus === 'refunded' ? 'bg-red-50 text-red-700 border border-red-100' : ''}
                              `}>
                                {currentStatus}
                              </span>
                            </td>
                            <td className="py-5 text-right font-medium text-[#1A1A1A] px-2">
                              ৳{order.total.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}