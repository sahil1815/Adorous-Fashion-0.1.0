import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { getCurrentUser } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import PasswordChangeClient from "./PasswordChangeClient";
import ProfileClient from "./ProfileClient";
import { ShoppingBag, LogOut, Package } from "lucide-react";

export const dynamic = "force-dynamic";

// ✅ Helper function to give every single status a clear, distinct, visible color
const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "pending":
    case "paid":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "processing":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "accepted":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "in_transit":
    case "shipped":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ready_for_delivery":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "returned":
    case "cancelled":
    case "refunded":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default async function AccountPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/login");
  }

  await connectDB();
  const userId = sessionUser.id;

  const dbUser = await User.findById(userId).lean();

  // ✅ UPDATED QUERY: We are now populating "items.product" so we can get the product slug for the links!
  const orders = await Order.find({
    $or: [{ user: userId }, { guestEmail: sessionUser.email }],
  })
    .populate({
      path: "items.product",
      select: "slug",
    })
    .sort({ createdAt: -1 })
    .lean();

  const initial =
    dbUser?.name?.charAt(0).toUpperCase() ||
    sessionUser.name?.charAt(0).toUpperCase() ||
    "U";

  return (
    <main className="min-h-screen bg-[#FCFBFA] pt-32 md:pt-40 pb-24 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
            <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div
                className="w-24 h-24 rounded-full bg-[#F7E7CE]/40 text-[#B76E79] flex items-center justify-center text-3xl mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {initial}
              </div>
              <h2
                className="text-xl font-medium text-[#1A1A1A] mb-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {dbUser?.name || sessionUser.name}
              </h2>
              <p className="text-xs text-gray-500 mb-8 truncate w-full px-2">
                {dbUser?.email || sessionUser.email}
              </p>

              <div className="w-full h-px bg-gray-100 mb-6"></div>

              <div className="w-full space-y-3">
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#F7E7CE]/30 px-4 py-3.5 text-[11px] uppercase tracking-wider font-semibold text-[#B76E79] transition hover:bg-[#F7E7CE]/60"
                >
                  <ShoppingBag size={14} />
                  Continue shopping
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-8">
            <ProfileClient
              user={{
                name: dbUser?.name,
                email: dbUser?.email,
                phone: dbUser?.phone,
              }}
            />

            <PasswordChangeClient />

            {/* Order History Section */}
            <div id="order-history" className="bg-white rounded-[20px] p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-8">
                <Package className="text-gray-400" size={20} />
                <h3
                  className="text-xl font-medium text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Order History
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-2xl">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <ShoppingBag className="text-gray-300" size={24} />
                  </div>
                  <p className="text-gray-500 mb-6 text-sm">
                    You haven't placed any orders yet.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-[#1A1A1A] text-white uppercase tracking-wider text-[11px] font-semibold px-8 py-3 hover:bg-[#B76E79] transition-colors rounded-full"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="pb-4 font-semibold px-2">Order ID</th>
                        {/* ✅ NEW: Items Column */}
                        <th className="pb-4 font-semibold px-2">Items</th>
                        {/* ✅ UPDATED: Date & Time Header */}
                        <th className="pb-4 font-semibold px-2">Date & Time</th>
                        <th className="pb-4 font-semibold px-2">Status</th>
                        <th className="pb-4 font-semibold text-right px-2">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order: any) => {
                        // ✅ SPLIT DATE AND TIME (Forced to Bangladesh Time)
                        const createdAt = new Date(order.createdAt);
                        const date = createdAt.toLocaleDateString("en-US", {
                          timeZone: "Asia/Dhaka",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                        const time = createdAt.toLocaleTimeString("en-US", {
                          timeZone: "Asia/Dhaka",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        });

                        const currentStatus = order.status || "pending";
                        const badgeStyle = getStatusBadgeStyles(currentStatus);
                        const displayStatus = currentStatus.replace(/_/g, " ");

                        return (
                          <tr
                            key={order._id.toString()}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="py-5 font-medium text-[#1A1A1A] px-2 align-top">
                              {order.orderNumber}
                            </td>

                            {/* ✅ NEW: Items List with Clickable Links and Thumbnails */}
                            <td className="py-5 px-2 align-top">
                              <div className="flex flex-col gap-3">
                                {order.items.map((item: any, index: number) => {
                                  // If product exists in DB, link to it. If deleted, search for the name as a fallback!
                                  const productSlug = item.product?.slug;
                                  const itemHref = productSlug
                                    ? `/products/${productSlug}`
                                    : `/search?q=${encodeURIComponent(item.name)}`;

                                  return (
                                    <Link
                                      key={index}
                                      href={itemHref}
                                      className="flex items-start gap-3 group"
                                      title={item.name}
                                    >
                                      <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                      </div>
                                      <div className="flex flex-col max-w-[180px]">
                                        <span className="text-[12px] font-medium text-[#1A1A1A] group-hover:text-[#B76E79] transition-colors truncate">
                                          {item.name}
                                        </span>
                                        <span className="text-[10px] text-gray-500 mt-0.5">
                                          Qty: {item.quantity}
                                        </span>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </td>

                            {/* ✅ UPDATED: Date and Time Display */}
                            <td className="py-5 px-2 align-top">
                              <div className="text-[13px] text-[#1A1A1A] font-medium">
                                {date}
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1">
                                {time}
                              </div>
                            </td>

                            <td className="py-5 px-2 align-top">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${badgeStyle}`}
                              >
                                {displayStatus}
                              </span>
                            </td>

                            <td className="py-5 text-right font-medium text-[#1A1A1A] px-2 align-top">
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
