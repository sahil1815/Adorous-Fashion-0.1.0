// app/admin/categories/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  // Fetch categories on page load
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  // Handle Create Category
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "Category added successfully!" });
        setName("");
        setSlug("");
        setDescription("");
        fetchCategories(); // Refresh the list
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create category" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "A network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Category
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        fetchCategories(); // Refresh the list
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#1A1A1A] tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>
          Manage Categories
        </h1>
        <p className="text-sm text-[#1A1A1A]/60 mt-1">Add, view, and remove product categories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: Add New Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 border border-[#1A1A1A]/10 shadow-sm rounded-sm">
            <h2 className="text-sm tracking-widest uppercase text-[#1A1A1A] mb-6 font-medium flex items-center gap-2">
              <Plus size={16} /> New Category
            </h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-[#1A1A1A]/70 uppercase tracking-wide mb-2">Category Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={handleNameChange} 
                  required 
                  placeholder="e.g. Fine Necklaces"
                  className="w-full border border-[#1A1A1A]/20 p-3 text-sm focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#1A1A1A]/70 uppercase tracking-wide mb-2">URL Slug</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  required 
                  placeholder="fine-necklaces"
                  className="w-full border border-[#1A1A1A]/20 p-3 text-sm focus:outline-none focus:border-[#B76E79] bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs text-[#1A1A1A]/70 uppercase tracking-wide mb-2">Description (Optional)</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={3}
                  className="w-full border border-[#1A1A1A]/20 p-3 text-sm focus:outline-none focus:border-[#B76E79]"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#1A1A1A] text-white uppercase tracking-widest text-xs py-4 hover:bg-[#B76E79] transition-colors disabled:opacity-50 mt-2"
              >
                {isSubmitting ? "Saving..." : "Save Category"}
              </button>

              {message && (
                <div className={`p-3 text-xs mt-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* RIGHT COL: Existing Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#1A1A1A]/10 shadow-sm rounded-sm overflow-hidden">
            <table className="w-full text-left text-sm text-[#1A1A1A]">
              <thead className="bg-gray-50 border-b border-[#1A1A1A]/10 uppercase text-[10px] tracking-widest text-[#1A1A1A]/60">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-[#1A1A1A]/50">Loading categories...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-[#1A1A1A]/50">No categories found. Create your first one!</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#1A1A1A]">{cat.name}</td>
                      <td className="px-6 py-4 text-[#1A1A1A]/60 font-mono text-xs">{cat.slug}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(cat._id)}
                          className="text-[#1A1A1A]/40 hover:text-red-500 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}