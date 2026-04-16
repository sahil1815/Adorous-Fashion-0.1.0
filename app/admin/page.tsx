// app/admin/page.tsx
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { Bell, User, Package, Info } from "lucide-react"; // Using lucide-react for clean icons!

// Tell Next.js to fetch fresh data every time this page loads
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch the latest 10 notifications from the database
  await connectDB();
  const notifications = await Notification.find({})
    .sort({ createdAt: -1 }) // Newest first
    .limit(10)
    .lean();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[#1A1A1A]" style={{ fontFamily: "var(--font-serif)" }}>
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your e-commerce store
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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
              <div className="mt-5">
                <div className="-ml-2 -mt-2 flex flex-wrap items-bottom">
                  <Link
                    href="/admin/products"
                    className="ml-2 mt-2 bg-[#F7E7CE] hover:bg-[#B76E79] hover:text-white px-3 py-2 rounded-md text-sm font-medium text-[#B76E79] transition-colors"
                  >
                    View Products
                  </Link>
                  <Link
                    href="/admin/products/new"
                    className="ml-2 mt-2 bg-[#B76E79] hover:bg-[#1A1A1A] px-3 py-2 rounded-md text-sm font-medium text-white transition-colors"
                  >
                    Add Product
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Orders
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      View and manage orders
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <div className="-ml-2 -mt-2 flex flex-wrap items-bottom">
                  <Link
                    href="/admin/orders"
                    className="ml-2 mt-2 bg-[#F7E7CE] hover:bg-[#B76E79] hover:text-white px-3 py-2 rounded-md text-sm font-medium text-[#B76E79] transition-colors"
                  >
                    View Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Categories
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Organize products
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <div className="-ml-2 -mt-2 flex flex-wrap items-bottom">
                  <Link
                    href="/admin/categories"
                    className="ml-2 mt-2 bg-[#F7E7CE] hover:bg-[#B76E79] hover:text-white px-3 py-2 rounded-md text-sm font-medium text-[#B76E79] transition-colors"
                  >
                    View Categories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-[#B76E79]">0</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-[#B76E79]">0</div>
              <div className="text-sm text-gray-600">Active Orders</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-[#B76E79]">0</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-[#B76E79]">0</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY (NOTIFICATIONS) */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Bell size={20} className="text-[#B76E79]" />
              Recent Activity
            </h2>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No recent activity.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notification: any) => {
                  // Determine icon and color based on notification type
                  let Icon = Info;
                  let colorClass = "bg-gray-100 text-gray-500";
                  
                  if (notification.type === "profile_update") {
                    Icon = User;
                    colorClass = "bg-blue-50 text-blue-600";
                  } else if (notification.type === "new_order") {
                    Icon = Package;
                    colorClass = "bg-green-50 text-green-600";
                  }

                  const timeString = new Date(notification.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                  const dateString = new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <li key={notification._id.toString()} className={`p-5 transition-colors hover:bg-gray-50 ${!notification.isRead ? 'bg-[#F7E7CE]/10' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full mt-0.5 ${colorClass}`}>
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