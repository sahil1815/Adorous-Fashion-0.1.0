// app/admin/orders/page.tsx
import Link from "next/link"; // ADDED THIS
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
// Import User model in case we need to populate logged-in user data
import "@/models/User";

export const dynamic = "force-dynamic"; // Ensures fresh data on every load

export default async function AdminOrders() {
  // Connect to the database and fetch all orders, newest first
  await connectDB();
  
  // Populate the 'user' field in case it's not a guest checkout, 
  // so we can grab the user's email if needed.
  const rawOrders = await Order.find()
    .populate("user", "email name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Orders
          </h1>
          <p className="text-sm text-gray-500 tracking-wide">
            Manage incoming orders and update shipping statuses.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-widest text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rawOrders.length > 0 ? (
                rawOrders.map((order: any) => {
                  // Format the date nicely
                  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  });
                  
                  // Extract customer details mapping from your actual schema
                  const customerName = order.shippingAddress?.fullName || "Unknown Customer";
                  const customerEmail = order.guestEmail || order.user?.email || "No email provided";
                  const orderTotal = order.total || 0;
                  const currentStatus = order.status || "pending";
                  
                  return (
                    <tr key={order._id.toString()} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 tracking-wide">{date}</td>
                      <td className="px-6 py-4">
                        <p className="text-[#1A1A1A]">{customerName}</p>
                        <p className="text-xs text-gray-400">{customerEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-[#1A1A1A] font-medium">
                        ${orderTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider
                          ${currentStatus === 'pending' || currentStatus === 'paid' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${currentStatus === 'processing' ? 'bg-orange-100 text-orange-800' : ''}
                          ${currentStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                          ${currentStatus === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${currentStatus === 'cancelled' || currentStatus === 'refunded' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* CHANGED FROM BUTTON TO LINK */}
                        <Link 
                          href={`/admin/orders/${order._id.toString()}`}
                          className="text-[11px] uppercase tracking-widest text-[#B76E79] hover:text-[#1A1A1A] transition-colors font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}