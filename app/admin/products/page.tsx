// app/admin/products/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit } from "lucide-react"; // Removed Trash2 from here
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import DeleteButton from "./DeleteButton"; // IMPORT YOUR NEW BUTTON

// Ensures Category model is registered before we populate it
import "@/models/Category";

export const dynamic = "force-dynamic"; // Ensures the page always fetches fresh data

export default async function AdminProducts() {
  // Connect to the database and fetch all products, newest first
  await connectDB();
  const rawProducts = await Product.find()
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-10">
      {/* Header section with Add Product button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1
            className="text-3xl font-light text-[#1A1A1A] mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Products
          </h1>
          <p className="text-sm text-gray-500 tracking-wide">
            Manage your inventory, update pricing, and add new collections.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="relative z-10 cursor-pointer inline-flex items-center justify-center bg-[#1A1A1A] text-white px-6 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-[#B76E79] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </Link>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-widest text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rawProducts.length > 0 ? (
                rawProducts.map((product: any) => {
                  // Safely extract properties based on your DB schema
                  const imageUrl = product.images?.[0]?.url;
                  const imageAlt = product.images?.[0]?.alt || product.name;
                  const categoryName =
                    product.category?.name || "Uncategorized";
                  const price = product.basePrice || 0;
                  const stock = product.stock || 0; 

                  return (
                    <tr
                      key={product._id.toString()}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative h-12 w-10 bg-gray-100 flex-shrink-0 border border-gray-200">
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={imageAlt}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <span className="font-medium text-[#1A1A1A]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {categoryName}
                      </td>
                      <td className="px-6 py-4 text-[#1A1A1A] font-medium">
                        ${price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${stock === 0 ? "text-red-500 font-medium" : "text-[#1A1A1A]"}`}
                        >
                          {stock > 0 ? `${stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider
                          ${product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        `}
                        >
                          {product.isActive ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/products/${product._id.toString()}/edit`}
                            className="text-[#B76E79] hover:underline"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          
                          {/* USE THE NEW COMPONENT HERE */}
                          <DeleteButton productId={product._id.toString()} />
                          
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 italic"
                  >
                    No products found. Click "Add Product" to get started.
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