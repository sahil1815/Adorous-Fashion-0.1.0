"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export default function StockEditor({ productId, initialStock }: { productId: string, initialStock: number }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [stock, setStock] = useState(initialStock.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: parseInt(stock) || 0 }),
      });

      if (response.ok) {
        setIsEditing(false);
        router.refresh(); // Refresh the table to show the new stock
      } else {
        alert("Failed to update stock");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input 
          type="number" 
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-16 px-2 py-1 text-sm border border-[#B76E79] rounded outline-none"
          autoFocus
        />
        <button onClick={handleSave} disabled={isSaving} className="text-green-600 hover:text-green-800 disabled:opacity-50">
          <Check size={16} />
        </button>
        <button onClick={() => { setIsEditing(false); setStock(initialStock.toString()); }} disabled={isSaving} className="text-red-500 hover:text-red-700 disabled:opacity-50">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={`cursor-pointer hover:bg-gray-100 px-2 py-1 -ml-2 rounded inline-block transition-colors ${initialStock === 0 ? "text-red-500 font-medium" : "text-[#1A1A1A]"}`}
      title="Click to edit stock"
    >
      {initialStock > 0 ? `${initialStock} in stock` : "Out of stock"}
    </div>
  );
}