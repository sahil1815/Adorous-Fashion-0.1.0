// app/admin/products/DeleteButton.tsx
"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // router.refresh() magically tells Next.js to re-fetch the Server Component!
        router.refresh(); 
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (error) {
      alert("A network error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`transition-colors ${
        isDeleting ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-red-500"
      }`}
      title="Delete Product"
    >
      <Trash2 size={16} />
    </button>
  );
}