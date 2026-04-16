// app/admin/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, CreditCard, Truck, ChevronDown } from "lucide-react";

// ✅ Added "Cancelled" to the options
const STATUS_OPTIONS = [
  { value: "processing", label: "Processing" },
  { value: "accepted", label: "Accepted" },
  { value: "in_transit", label: "In Transit" },
  { value: "ready_for_delivery", label: "Ready For Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
  { value: "cancelled", label: "Cancelled" }, 
];

// ✅ Helper function to determine the color based on the status
const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "returned":
      return "bg-slate-100 text-slate-800 border-slate-300";
    default:
      // Your default elegant colors for active processing stages
      return "bg-[#F7E7CE]/30 text-[#1A1A1A] border-[#F7E7CE]";
  }
};

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.order) setOrder(data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setOrder({ ...order, status: newStatus });
    } catch (error) {
      alert("Failed to update order status. Please try again.");
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center text-[#1A1A1A]/50">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-10 text-center text-red-500">Order not found.</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <Link href="/admin/orders" className="inline-flex items-center text-[11px] uppercase tracking-widest text-gray-500 hover:text-[#B76E79] transition-colors mb-6">
        <ArrowLeft size={14} className="mr-2" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-[#1A1A1A] tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>
            Order {order.orderNumber}
          </h1>
          <p className="text-sm text-[#1A1A1A]/60 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* THE INTERACTIVE STATUS DROPDOWN (Now with dynamic colors!) */}
        <div className="relative flex items-center">
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdatingStatus}
            // ✅ We inject the dynamic color function directly into the className
            className={`appearance-none px-5 py-2.5 pr-10 text-[11px] tracking-widest uppercase font-semibold border outline-none cursor-pointer disabled:opacity-50 transition-colors ${getStatusColor(order.status)}`}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${order.status === 'delivered' || order.status === 'returned' || order.status === 'cancelled' ? 'opacity-60' : 'text-[#1A1A1A]'}`}>
            <ChevronDown size={14} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#1A1A1A]/10 p-6 shadow-sm">
            <h2 className="text-sm tracking-widest uppercase text-[#1A1A1A] mb-6 flex items-center gap-2">
              <Package size={16} /> Items Ordered
            </h2>
            <div className="divide-y divide-[#1A1A1A]/10">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="py-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-[#1A1A1A]/10" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{item.name}</p>
                      <p className="text-xs text-[#1A1A1A]/50 font-mono mt-1">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#1A1A1A]">${item.price.toFixed(2)} x {item.quantity}</p>
                    <p className="text-sm font-semibold text-[#1A1A1A] mt-1">${item.subtotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="border-t border-[#1A1A1A]/10 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-[#1A1A1A]/70">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#1A1A1A]/70">
                <span>Shipping</span>
                <span>${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#1A1A1A] pt-2">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white border border-[#1A1A1A]/10 p-6 shadow-sm">
            <h2 className="text-sm tracking-widest uppercase text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Truck size={16} /> Shipping Details
            </h2>
            <p className="text-sm text-[#1A1A1A] font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-[#1A1A1A]/70 mt-1">{order.guestEmail}</p>
            <p className="text-sm text-[#1A1A1A]/70">{order.shippingAddress.phone}</p>
            <div className="mt-4 text-sm text-[#1A1A1A]/70 leading-relaxed">
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-white border border-[#1A1A1A]/10 p-6 shadow-sm">
            <h2 className="text-sm tracking-widest uppercase text-[#1A1A1A] mb-4 flex items-center gap-2">
              <CreditCard size={16} /> Payment
            </h2>
            <p className="text-sm text-[#1A1A1A]/70">
              Method: <span className="font-medium text-[#1A1A1A]">{order.paymentMethod}</span>
            </p>
            <p className="text-sm text-[#1A1A1A]/70 mt-1">
              Status: <span className="font-medium text-[#1A1A1A] capitalize">{order.paymentStatus}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}