// app/admin/products/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, UploadCloud } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);

  // Fetch both Categories and the existing Product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        if (catData.categories) setCategories(catData.categories);

        const prodRes = await fetch(`/api/products/${id}`);
        const prodData = await prodRes.json();
        if (prodData.product) setProduct(prodData.product);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      collections: formData.getAll("collections"),
      basePrice: Number(formData.get("price")),
      compareAtPrice: formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : undefined,
      stock: Number(formData.get("stock")), 
      primaryImage: formData.get("primaryImage"),
      images: [ 
        { url: formData.get("primaryImage"), alt: formData.get("name") },
        formData.get("hoverImage") ? { url: formData.get("hoverImage"), alt: `${formData.get("name")} hover` } : null
      ].filter(Boolean),
      isActive: formData.get("isActive") === "on", 
    };

    try {
      // Send a PUT request to update instead of POST
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Product updated successfully!");
        router.push("/admin/products"); 
      } else {
        alert(`Failed to update product: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full border border-gray-300 bg-white text-[#1A1A1A] p-3 text-sm focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all";
  const labelClass = "block text-[11px] font-medium uppercase tracking-[0.1em] text-gray-500 mb-2";

  if (isLoading) return <div className="p-10 text-center text-[#1A1A1A]/50">Loading product data...</div>;
  if (!product) return <div className="p-10 text-center text-red-500">Product not found.</div>;

  // Safely extract existing images
  const primaryImageUrl = product.images?.[0]?.url || "";
  const hoverImageUrl = product.images?.[1]?.url || "";

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center text-[11px] uppercase tracking-widest text-gray-500 hover:text-[#B76E79] transition-colors mb-4">
          <ArrowLeft size={14} className="mr-2" /> Back to Inventory
        </Link>
        <h1 className="text-3xl font-light text-[#1A1A1A]" style={{ fontFamily: "var(--font-serif)" }}>
          Edit Product
        </h1>
      </div>

      {/* Notice we use defaultValue/defaultChecked to pre-fill the fields! */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">Basic Information</h2>
            
            <div>
              <label className={labelClass}>Product Name *</label>
              <input type="text" name="name" defaultValue={product.name} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea name="description" defaultValue={product.description} required rows={4} className={inputClass} />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Category *</label>
                <select name="category" defaultValue={product.category} required className={inputClass}>
                  <option value="">Select a category...</option>
                  {categories.map((cat: any) => (
                    <optgroup key={cat._id} label={cat.name}>
                      <option value={cat._id}>{cat.name}</option>
                      {cat.children && cat.children.map((child: any) => (
                        <option key={child._id} value={child._id}>↳ {child.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Status</label>
                <div className="flex items-center h-[46px] px-3 border border-gray-300">
                  <input type="checkbox" name="isActive" id="isActive" defaultChecked={product.isActive} className="w-4 h-4 text-[#B76E79]" />
                  <label htmlFor="isActive" className="ml-2 text-sm text-[#1A1A1A]">Active on storefront</label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className={labelClass}>Marketing Collections</label>
              <div className="flex flex-wrap gap-6 mt-2">
                <label className="flex items-center text-sm text-[#1A1A1A]">
                  <input type="checkbox" name="collections" value="new-arrivals" defaultChecked={product.collections?.includes("new-arrivals")} className="w-4 h-4 mr-2 text-[#B76E79]" />
                  New Arrivals
                </label>
                <label className="flex items-center text-sm text-[#1A1A1A]">
                  <input type="checkbox" name="collections" value="best-sellers" defaultChecked={product.collections?.includes("best-sellers")} className="w-4 h-4 mr-2 text-[#B76E79]" />
                  Best Sellers
                </label>
                <label className="flex items-center text-sm text-[#1A1A1A]">
                  <input type="checkbox" name="collections" value="spring" defaultChecked={product.collections?.includes("spring")} className="w-4 h-4 mr-2 text-[#B76E79]" />
                  Edit: Spring
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Price ($) *</label>
                <input type="number" name="price" defaultValue={product.basePrice} step="0.01" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Compare at Price ($)</label>
                <input type="number" name="compareAtPrice" defaultValue={product.compareAtPrice} step="0.01" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <UploadCloud size={20} className="text-gray-400" />
              <h2 className="text-lg font-medium text-[#1A1A1A]">Media URLs</h2>
            </div>
            <div>
              <label className={labelClass}>Primary Image URL *</label>
              <input type="url" name="primaryImage" defaultValue={primaryImageUrl} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Hover Image URL</label>
              <input type="url" name="hoverImage" defaultValue={hoverImageUrl} className={inputClass} />
            </div>
          </div>

          <div className="bg-gray-50 p-6 border border-gray-200 flex flex-col space-y-4">
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#1A1A1A] text-white uppercase tracking-[0.2em] text-[12px] py-4 hover:bg-[#B76E79] transition-colors disabled:opacity-50">
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}