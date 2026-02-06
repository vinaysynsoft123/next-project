"use client";

import Link from "next/link";
import CartIcon from "@/app/components/CartIcon";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="text-xl font-bold tracking-wide">
            ShopEase
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/products" className="hover:text-blue-600 transition">
              Products
            </Link>
            <Link href="/cart" className="hover:text-blue-600 transition">
              Cart
            </Link>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            <CartIcon />
            
            {user ? (
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-medium hover:text-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
