import Link from "next/link";

export default function Navbar() {
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
            <Link
              href="/"
              className="hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-blue-600 transition"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="hover:text-blue-600 transition"
            >
              Cart
            </Link>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-block text-sm font-medium hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              href="/cart"
              className="relative rounded-full border border-zinc-300 p-2 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              🛒
              {/* Cart count badge (optional) */}
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center dark:bg-white dark:text-black">
                2
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
