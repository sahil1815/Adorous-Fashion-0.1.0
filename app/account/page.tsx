import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // 1. Connect to the database
  await connectDB();

  // 2. Safely grab the user's ID (NextAuth usually uses .id, but MongoDB uses ._id)
  const userId = user.id; 

  // 3. Fetch orders tied to their account OR their email (in case of guest checkouts)
  const orders = await Order.find({
    $or: [{ user: userId }, { guestEmail: user.email }]
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      {/* Widened the max-w to 4xl to give the order table more breathing room */}
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="rounded-3xl border border-[#F7E7CE] bg-[#FFF8F2] p-10 shadow-sm">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              Welcome back, {user.name}
            </h1>
            <p className="text-sm text-[#1A1A1A]/70">
              Manage your account, review orders, and checkout faster.
            </p>
          </div>

          {/* Top Row: Profile & Quick Actions */}
          <div className="grid gap-6 sm:grid-cols-2 mb-10">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#1A1A1A]/5">
              <h2 className="text-xl font-medium text-[#1A1A1A] mb-4">Profile</h2>
              <p className="text-sm text-[#1A1A1A]/80">Name</p>
              <p className="mb-4 text-base text-[#1A1A1A]">{user.name}</p>
              <p className="text-sm text-[#1A1A1A]/80">Email</p>
              <p className="text-base text-[#1A1A1A]">{user.email}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#1A1A1A]/5">
              <h2 className="text-xl font-medium text-[#1A1A1A] mb-4">Quick actions</h2>
              <div className="space-y-3">
                <Link
                  href="/shop"
                  className="block rounded-full border border-[#B76E79] px-4 py-3 text-center text-sm font-semibold text-[#B76E79] transition hover:bg-[#B76E79] hover:text-white"
                >
                  Continue shopping
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#1A1A1A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Row: Order History */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#1A1A1A]/5">
            <h2 className="text-xl font-medium text-[#1A1A1A] mb-6">Order history</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[#1A1A1A]/70 mb-6 tracking-wide">You haven't placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="inline-block bg-[#1A1A1A] text-white uppercase tracking-[0.2em] text-[12px] px-8 py-3 hover:bg-[#B76E79] transition-colors"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#1A1A1A]/10 text-[#1A1A1A]/60 text-[11px] uppercase tracking-widest">
                    <tr>
                      <th className="pb-4 font-medium">Order ID</th>
                      <th className="pb-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/5">
                    {orders.map((order: any) => {
                      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      });
                      const currentStatus = order.status || "pending";
                      
                      return (
                        <tr key={order._id.toString()} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 font-medium text-[#1A1A1A]">{order.orderNumber}</td>
                          <td className="py-4 text-[#1A1A1A]/70">{date}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider
                              ${currentStatus === 'pending' || currentStatus === 'paid' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${currentStatus === 'processing' ? 'bg-orange-100 text-orange-800' : ''}
                              ${currentStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                              ${currentStatus === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                              ${currentStatus === 'cancelled' || currentStatus === 'refunded' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {currentStatus}
                            </span>
                          </td>
                          <td className="py-4 text-right font-medium text-[#1A1A1A]">
                            ${order.total.toFixed(2)}
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