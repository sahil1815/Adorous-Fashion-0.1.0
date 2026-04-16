"use client";

import { useState } from "react";
import { User, Mail, Phone, Edit2 } from "lucide-react";

export default function ProfileClient({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // STEP 2: We will connect this to the database API in the next step!
    alert("In Step 2, this will save to the database and notify the admin!");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-medium text-[#1A1A1A]" style={{ fontFamily: "var(--font-serif)" }}>
            Personal Information
          </h3>
          <p className="text-sm text-gray-500 mt-1">Manage your details and contact info.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-[#B76E79] bg-[#F7E7CE]/30 hover:bg-[#F7E7CE]/60 px-4 py-2 rounded-full transition-colors"
          >
            <Edit2 size={12} />
            Edit
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name Box */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-start gap-4">
            <div className="mt-0.5 text-gray-400"><User size={18} /></div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-medium">Name</p>
              <p className="text-sm text-[#1A1A1A] font-medium">{formData.name}</p>
            </div>
          </div>

          {/* Email Box */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-start gap-4">
            <div className="mt-0.5 text-gray-400"><Mail size={18} /></div>
            <div className="overflow-hidden">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-medium">Email</p>
              <p className="text-sm text-[#1A1A1A] font-medium truncate">{formData.email}</p>
            </div>
          </div>

          {/* Phone Box */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-start gap-4 sm:col-span-2 lg:col-span-1">
            <div className="mt-0.5 text-gray-400"><Phone size={18} /></div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-medium">Phone</p>
              <p className="text-sm text-[#1A1A1A] font-medium">{formData.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="block text-[11px] uppercase tracking-wider font-medium text-gray-600">
              Name
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79]/20"
                required
              />
            </label>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-gray-600">
              Email
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79]/20"
                required
              />
            </label>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-gray-600 sm:col-span-2">
              Phone
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79]/20"
                required
              />
            </label>
          </div>
          
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="bg-[#1A1A1A] px-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-white transition hover:bg-[#B76E79] rounded-xl"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
              }}
              className="bg-white border border-gray-200 px-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-600 transition hover:bg-gray-50 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}