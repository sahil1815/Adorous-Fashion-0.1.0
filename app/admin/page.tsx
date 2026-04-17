// app/admin/page.tsx
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import Order from "@/models/Order"; // ✅ Added Order model so we can fetch analytics
import {
  Bell,
  User,
  Package,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  // 1. Fetch Notifications
  const notifications = await Notification.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // 2. Fetch Global Status Counts (Delivered, Cancelled, Returned)
  const globalStatsRaw = await Order.aggregate([
    { $match: { status: { $in: ["delivered", "cancelled", "returned"] } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // Set default values so the dashboard always shows numbers, even if 0
  const globalStats = { delivered: 0, cancelled: 0, returned: 0 };
  globalStatsRaw.forEach((stat: any) => {
    if (stat._id === "delivered") globalStats.delivered = stat.count;
    if (stat._id === "cancelled") globalStats.cancelled = stat.count;
    if (stat._id === "returned") globalStats.returned = stat.count;
  });

  // 3. Fetch City/District Analytics
  const cityStatsRaw = await Order.aggregate([
    { $match: { status: { $in: ["delivered", "cancelled", "returned"] } } },
    {
      $group: {
        _id: {
          city: "$shippingAddress.city",
          status: "$status",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Organize the city data into a clean array for our table
  const cityDataMap: Record<string, any> = {};
  cityStatsRaw.forEach((stat: any) => {
    // Fallback to "Unknown" if an order somehow has no city attached
    const city = stat._id.city || "Unknown";
    const status = stat._id.status;

    if (!cityDataMap[city]) {
      cityDataMap[city] = { city, delivered: 0, cancelled: 0, returned: 0 };
    }

    if (status === "delivered") cityDataMap[city].delivered = stat.count;
    if (status === "cancelled") cityDataMap[city].cancelled = stat.count;
    if (status === "returned") cityDataMap[city].returned = stat.count;
  });

  // Convert the map to an array and sort it by cities with the highest deliveries
  const cityAnalytics = Object.values(cityDataMap).sort(
    (a: any, b: any) => b.delivered - a.delivered,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-light text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your e-commerce store and view analytics
          </p>
        </div>

        {/* Top Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-[16px]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-[#B76E79]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Products
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Manage inventory
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Link
                  href="/admin/products"
                  className="bg-[#F7E7CE]/30 hover:bg-[#F7E7CE]/60 px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-semibold text-[#B76E79] transition-colors"
                >
                  View Products
                </Link>
                <Link
                  href="/admin/products/new"
                  className="bg-[#B76E79] hover:bg-[#1A1A1A] px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-semibold text-white transition-colors"
                >
                  Add Product
                </Link>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-[16px]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-[#B76E79]" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Orders
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      View and manage
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/orders"
                  className="bg-[#F7E7CE]/30 hover:bg-[#F7E7CE]/60 px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-semibold text-[#B76E79] transition-colors"
                >
                  View Orders
                </Link>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-[16px]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-[#B76E79]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Categories
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Organize store
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/categories"
                  className="bg-[#F7E7CE]/30 hover:bg-[#F7E7CE]/60 px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-semibold text-[#B76E79] transition-colors"
                >
                  View Categories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --- NEW FEATURE: ORDER FULFILLMENT ANALYTICS --- */}
        <div className="mt-12">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Package size={20} className="text-[#B76E79]" />
              Fulfillment Analytics
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track your overall delivery success rates.
            </p>
          </div>

          {/* Global Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-[16px] shadow-sm border border-green-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-full">
                <CheckCircle size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider text-[11px]">
                  Total Delivered
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {globalStats.delivered}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[16px] shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-full">
                <RefreshCw size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider text-[11px]">
                  Total Returned
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {globalStats.returned}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[16px] shadow-sm border border-red-100 flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-full">
                <XCircle size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider text-[11px]">
                  Total Cancelled
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {globalStats.cancelled}
                </div>
              </div>
            </div>
          </div>

          {/* Geographic Breakdown Table */}
          <div className="bg-white shadow-sm rounded-[16px] overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-800">
                Performance by District / City
              </h3>
            </div>

            {cityAnalytics.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No closed orders available to analyze yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-100 text-gray-500 text-[10px] uppercase tracking-wider bg-white">
                    <tr>
                      <th className="px-6 py-4 font-semibold">
                        City / District
                      </th>
                      <th className="px-6 py-4 font-semibold text-center text-green-700">
                        Delivered
                      </th>
                      <th className="px-6 py-4 font-semibold text-center text-slate-600">
                        Returned
                      </th>
                      <th className="px-6 py-4 font-semibold text-center text-red-700">
                        Cancelled
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cityAnalytics.map((stat: any, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                          {stat.city}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-green-600 bg-green-50/30">
                          {stat.delivered}
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-slate-600">
                          {stat.returned}
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-red-600 bg-red-50/30">
                          {stat.cancelled}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {/* ---------------------------------------------------- */}

        {/* RECENT ACTIVITY (NOTIFICATIONS) */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Bell size={20} className="text-[#B76E79]" />
              Recent Activity
            </h2>
          </div>

          <div className="bg-white shadow-sm rounded-[16px] overflow-hidden border border-gray-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                <p>No recent activity.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notification: any) => {
                  let Icon = Info;
                  let colorClass = "bg-gray-100 text-gray-500";

                  if (notification.type === "profile_update") {
                    Icon = User;
                    colorClass = "bg-blue-50 text-blue-600";
                  } else if (notification.type === "new_order") {
                    Icon = Package;
                    colorClass = "bg-green-50 text-green-600";
                  }

                  const timeString = new Date(
                    notification.createdAt,
                  ).toLocaleTimeString("en-US", {
                    timeZone: "Asia/Dhaka",
                    hour: "numeric",
                    minute: "2-digit",
                  });
                  const dateString = new Date(
                    notification.createdAt,
                  ).toLocaleDateString("en-US", {
                    timeZone: "Asia/Dhaka",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <li
                      key={notification._id.toString()}
                      className={`p-5 transition-colors hover:bg-gray-50 ${!notification.isRead ? "bg-[#F7E7CE]/5" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-full mt-0.5 ${colorClass}`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                              {dateString} at {timeString}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
