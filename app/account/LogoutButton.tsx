"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Hit the API in the background
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        // Show the success message
        alert("Logout successful!");
        
        // Redirect to the homepage
        router.push("/");
        
        // Refresh the router so the Navbar instantly realizes the user is gone
        router.refresh();
      } else {
        alert("Failed to log out. Please try again.");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[11px] uppercase tracking-wider font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
    >
      <LogOut size={14} />
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}