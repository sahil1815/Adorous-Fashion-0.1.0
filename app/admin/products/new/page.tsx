"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW: State to hold our dynamic categories
  const [categories, setCategories] = useState<any[]>([]);

  // NEW: Fetch categories as soon as the page loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Format the data exactly how the backend API and Mongoose model expect it
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"), // This will now grab the MongoDB _id from the select option
      basePrice: Number(formData.get("price")),
      compareAtPrice: formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : undefined,
      stock: Number(formData.get("stock")), 
      badge: formData.get("badge"),
      primaryImage: formData.get("primaryImage"),
      images: [ 
        { url: formData.get("primaryImage"), alt: formData.get("name") },
        formData.get("hoverImage") ? { url: formData.get("hoverImage"), alt: `${formData.get("name")} hover` } : null
      ].filter(Boolean),
      isActive: formData.get("isActive") === "on", 
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        router.push("/admin/products"); 
      } else {
        console.error("Backend Error:", responseData);
        alert(`Failed to add product: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full border border-gray-300 bg-white text-[#1A1A1A] p-3 text-sm focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all";
  const labelClass = "block text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500 mb-2";

  return (
    <div className="p-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center text-[11px] uppercase tracking-widest text-gray-500 hover:text-[#B76E79] transition-colors mb-4">
          <ArrowLeft size={14} className="mr-2" /> Back to Inventory
        </Link>
        <h1 className="text-3xl font-light text-[#1A1A1A]" style={{ fontFamily: "var(--font-serif)" }}>
          Add New Product
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info Box */}
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">Basic Information</h2>
            
            <div>
              <label className={labelClass}>Product Name *</label>
              <input type="text" name="name" required placeholder="e.g. Rosette Chain Necklace" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea 
                name="description" 
                required 
                rows={4} 
                placeholder="Describe the product details, materials, etc." 
                className={inputClass} 
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Category *</label>
                <select name="category" required className={inputClass}>
                  <option value="">Select a category...</option>
                  
                  {/* NEW: Dynamically map categories! */}
                  {categories.map((cat: any) => (
                    <optgroup key={cat._id} label={cat.name}>
                      {/* Let the user select the parent category itself */}
                      <option value={cat._id}>{cat.name}</option>
                      
                      {/* If this category has sub-categories, list them indented underneath */}
                      {cat.children && cat.children.map((child: any) => (
                        <option key={child._id} value={child._id}>
                          ↳ {child.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}

                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <div className="flex items-center h-[46px] px-3 border border-gray-300">
                  <input type="checkbox" name="isActive" id="isActive" defaultChecked className="w-4 h-4 text-[#B76E79] focus:ring-[#B76E79] border-gray-300 rounded" />
                  <label htmlFor="isActive" className="ml-2 text-sm text-[#1A1A1A]">Active on storefront</label>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Box */}
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Price ($) *</label>
                <input type="number" name="price" step="0.01" required placeholder="0.00" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Compare at Price ($)</label>
                <input type="number" name="compareAtPrice" step="0.01" placeholder="0.00" className={inputClass} />
                <p className="mt-1 text-[10px] text-gray-400 tracking-wide">To show a crossed-out sale price.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Initial Stock *</label>
                <input type="number" name="stock" required placeholder="e.g. 50" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Custom Badge</label>
                <input type="text" name="badge" placeholder="e.g. sale, new, limited" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column (Images & Submit) */}
        <div className="space-y-8">
          
          {/* Images Box */}
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <UploadCloud size={20} className="text-gray-400" />
              <h2 className="text-lg font-medium text-[#1A1A1A]">Media URLs</h2>
            </div>
            
            <div>
              <label className={labelClass}>Primary Image URL *</label>
              <input type="url" name="primaryImage" required placeholder="https://..." className={inputClass} />
              <p className="mt-1 text-[10px] text-gray-400 tracking-wide">The main image shown in the grid.</p>
            </div>

            <div>
              <label className={labelClass}>Hover Image URL</label>
              <input type="url" name="hoverImage" placeholder="https://..." className={inputClass} />
              <p className="mt-1 text-[10px] text-gray-400 tracking-wide">Image shown when a user hovers over the card.</p>
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-gray-50 p-6 border border-gray-200 flex flex-col space-y-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#1A1A1A] text-white uppercase tracking-[0.2em] text-[12px] py-4 hover:bg-[#B76E79] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
            <button 
              type="button"
              onClick={() => router.push("/admin/products")}
              className="w-full border border-[#1A1A1A]/20 text-[#1A1A1A] uppercase tracking-[0.2em] text-[12px] py-4 hover:bg-gray-100 transition-colors"
            >
              Discard
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}