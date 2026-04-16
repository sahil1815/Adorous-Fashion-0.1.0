// app/admin/orders/page.tsx
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User";
import OrderStatusDropdown from "./OrderStatusDropdown"; // ✅ Import our new interactive component

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  await connectDB();
  
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

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden rounded-[16px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-widest text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rawOrders.length > 0 ? (
                rawOrders.map((order: any) => {
                  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  });
                  
                  const customerName = order.shippingAddress?.fullName || "Unknown Customer";
                  const customerEmail = order.guestEmail || order.user?.email || "No email provided";
                  const orderTotal = order.total || 0;
                  const currentStatus = order.status || "pending";
                  
                  return (
                    <tr key={order._id.toString()} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 tracking-wide text-gray-500">{date}</td>
                      <td className="px-6 py-4">
                        <p className="text-[#1A1A1A] font-medium">{customerName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{customerEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-[#1A1A1A] font-medium">
                        ৳{orderTotal.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        {/* ✅ Replace the static span with our interactive dropdown component */}
                        <OrderStatusDropdown 
                          orderId={order._id.toString()} 
                          initialStatus={currentStatus} 
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/orders/${order._id.toString()}`}
                          className="text-[10px] uppercase tracking-widest font-semibold text-[#B76E79] bg-[#F7E7CE]/30 hover:bg-[#F7E7CE]/60 px-4 py-2 rounded-lg transition-colors"
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