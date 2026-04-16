import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; // We need this to fetch the phone number!
import ProfileClient from "./ProfileClient"; // Importing our new interactive component

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/login");
  }

  await connectDB();
  const userId = sessionUser.id; 

  // 1. Fetch the full user from the database to get their Phone Number
  const dbUser = await User.findById(userId).lean();

  // 2. Fetch orders
  const orders = await Order.find({
    $or: [{ user: userId }, { guestEmail: sessionUser.email }]
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    // Fixed Overlap: Used the same pt-[140px] and background color as the auth pages
    <main className="min-h-screen bg-[#F7E7CE]/30 pt-[140px] md:pt-[180px] pb-24 px-6">
      <div className="mx-auto w-full max-w-6xl">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
            Welcome back, {dbUser?.name || sessionUser.name}
          </h1>
          <p className="text-sm tracking-wide text-[#1A1A1A]/70">
            Manage your account, review orders, and update your details.
          </p>
        </div>

        {/* Premium Layout: 1/3 Profile Sidebar, 2/3 Order History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & Actions */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Interactive Profile Component */}
            <ProfileClient user={{
              name: dbUser?.name,
              email: dbUser?.email,
              phone: dbUser?.phone // Passing the phone number to the client component!
            }} />

            {/* Quick Actions Card */}
            <div className="bg-white rounded-sm border border-[#D8C2B6] p-8 shadow-sm">
              <h2 className="text-lg font-medium text-[#1A1A1A] mb-6">Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/shop"
                  className="block w-full rounded-sm border border-[#B76E79] px-4 py-3 text-center text-[11px] uppercase tracking-[0.15em] font-semibold text-[#B76E79] transition hover:bg-[#B76E79] hover:text-white"
                >
                  Continue shopping
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-sm bg-[#1A1A1A] px-4 py-3 text-center text-[11px] uppercase tracking-[0.15em] font-semibold text-white transition hover:bg-[#333333]"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2 bg-white rounded-sm border border-[#D8C2B6] p-8 shadow-sm">
            <h2 className="text-lg font-medium text-[#1A1A1A] mb-6">Order history</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-sm">
                <p className="text-[#1A1A1A]/70 mb-6 tracking-wide text-sm">You haven't placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="inline-block bg-[#1A1A1A] text-white uppercase tracking-[0.2em] text-[11px] px-8 py-3.5 hover:bg-[#B76E79] transition-colors rounded-sm"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#1A1A1A]/10 text-[#1A1A1A]/50 text-[10px] uppercase tracking-[0.15em]">
                    <tr>
                      <th className="pb-4 font-semibold">Order ID</th>
                      <th className="pb-4 font-semibold">Date</th>
                      <th className="pb-4 font-semibold">Status</th>
                      <th className="pb-4 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/5">
                    {orders.map((order: any) => {
                      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      });
                      const currentStatus = order.status || "pending";
                      
                      return (
                        <tr key={order._id.toString()} className="hover:bg-[#F7E7CE]/10 transition-colors">
                          <td className="py-5 font-medium text-[#1A1A1A] text-[13px]">{order.orderNumber}</td>
                          <td className="py-5 text-[#1A1A1A]/70 text-[13px]">{date}</td>
                          <td className="py-5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[9px] font-semibold uppercase tracking-wider
                              ${currentStatus === 'pending' || currentStatus === 'paid' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${currentStatus === 'processing' ? 'bg-orange-100 text-orange-800' : ''}
                              ${currentStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                              ${currentStatus === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                              ${currentStatus === 'cancelled' || currentStatus === 'refunded' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {currentStatus}
                            </span>
                          </td>
                          <td className="py-5 text-right font-medium text-[#1A1A1A]">
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
    </main>
  );
}