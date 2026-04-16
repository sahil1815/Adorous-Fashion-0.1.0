"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

// The official list of statuses
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "accepted", label: "Accepted" },
  { value: "in_transit", label: "In Transit" },
  { value: "ready_for_delivery", label: "Ready For Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
  { value: "cancelled", label: "Cancelled" },
];

// The exact same color logic we used on the User Profile!
const getStatusColor = (status: string) => {
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

export default function OrderStatusDropdown({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      // Call the API we built earlier
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setStatus(newStatus);
      // Silently refresh the page data in the background so your dashboard stats update too!
      router.refresh(); 
    } catch (error) {
      alert("Failed to update order status. Please try again.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative inline-block w-40">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isUpdating}
        className={`appearance-none w-full px-3 py-1.5 pr-8 text-[9px] tracking-widest uppercase font-bold border rounded-md outline-none cursor-pointer disabled:opacity-50 transition-colors ${getStatusColor(status)}`}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 opacity-60`}>
        <ChevronDown size={12} />
      </div>
    </div>
  );
}