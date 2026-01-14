import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 py-14">
        
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* BRAND */}
          <div>
            <h3 className="text-xl font-bold">ShopEase</h3>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Your one-stop destination for quality products, great prices, and
              fast delivery.
            </p>
          </div>

          {/* SHOP LINKS */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:underline">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:underline">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:underline">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@shopease.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Mon–Sat: 9AM – 6PM</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-12 border-t border-zinc-300 dark:border-zinc-800 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>

          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/refund" className="hover:underline">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
