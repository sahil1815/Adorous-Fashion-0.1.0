"use client";

import { useState } from "react";

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
    <div className="bg-white rounded-sm border border-[#D8C2B6] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-[#1A1A1A]">Profile</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#B76E79] hover:text-[#1A1A1A] transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#1A1A1A]/50 mb-1">Name</p>
            <p className="text-sm text-[#1A1A1A] font-medium">{formData.name}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#1A1A1A]/50 mb-1">Email</p>
            <p className="text-sm text-[#1A1A1A] font-medium">{formData.email}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#1A1A1A]/50 mb-1">Phone</p>
            <p className="text-sm text-[#1A1A1A] font-medium">{formData.phone || "Not provided"}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <label className="block text-[10px] uppercase tracking-[0.1em] text-[#1A1A1A]/70">
            Name
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-3 py-2 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79]"
              required
            />
          </label>
          <label className="block text-[10px] uppercase tracking-[0.1em] text-[#1A1A1A]/70">
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-3 py-2 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79]"
              required
            />
          </label>
          <label className="block text-[10px] uppercase tracking-[0.1em] text-[#1A1A1A]/70">
            Phone
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-3 py-2 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79]"
              required
            />
          </label>
          
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#1A1A1A] px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] font-semibold text-white transition hover:bg-[#B76E79] rounded-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({ name: user.name || "", email: user.email || "", phone: user.phone || "" }); // reset
              }}
              className="flex-1 border border-[#1A1A1A]/20 px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#1A1A1A] transition hover:bg-gray-50 rounded-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}