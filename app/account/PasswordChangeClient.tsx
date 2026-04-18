"use client";

import { useState } from "react";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function PasswordChangeClient() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      // Success! Clear the form and show success message
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Hide success message after a few seconds
      setTimeout(() => setSuccess(false), 5000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-sm border border-gray-100 mt-8">
      <div className="flex items-center gap-2 mb-8">
        <Lock className="text-gray-400" size={20} />
        <h3
          className="text-xl font-medium text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Change Password
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} />
            Password updated successfully!
          </div>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-2 pl-1">
            Current Password
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all bg-gray-50/50"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-2 pl-1">
            New Password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all bg-gray-50/50"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-2 pl-1">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all bg-gray-50/50"
            placeholder="Confirm new password"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#1A1A1A] text-white uppercase tracking-wider text-[11px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#B76E79] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}