import Image from "next/image";
import Link from "next/link";

import CategoriesSection from "@/app/components/CategoriesSection";

export default function HomePage() {
  return (
    <div className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white">
      {/* HERO SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Shop Smarter. <br /> Live Better.
          </h1>

          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            Discover premium products, unbeatable prices, and fast delivery —
            all in one place.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-black px-6 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Shop Now
            </Link>

            <Link
              href="/about"
              className="rounded-lg border border-zinc-300 px-6 py-3 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="relative h-[420px] w-full">
          <Image
            src="/hero.webp"
            alt="Ecommerce Hero"
            fill
            priority
            className="object-contain"
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <CategoriesSection />

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold">Featured Products</h2>
          <Link
            href="/products"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="rounded-xl bg-white dark:bg-zinc-900 shadow hover:shadow-lg transition"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={`/products/product-${id}.png`}
                  alt="Product"
                  fill
                  className="object-cover rounded-t-xl"
                />
              </div>

              <div className="p-5">
                <h3 className="font-medium">Premium Product</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  $199.00
                </p>

                <Link
                  href={`/products/product-${id}`}
                  className="mt-4 inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-10 py-16 text-center">
          <h2 className="text-4xl font-bold">Up to 50% Off</h2>
          <p className="mt-4 text-lg">
            Limited-time offers on selected products.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-black hover:bg-zinc-200 dark:bg-black dark:text-white dark:hover:bg-zinc-800"
          >
            Grab the Deal
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            "Fast Delivery",
            "Secure Payments",
            "24/7 Support",
          ].map((title) => (
            <div
              key={title}
              className="rounded-xl bg-white dark:bg-zinc-900 p-8 shadow"
            >
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                We ensure the best shopping experience for our customers.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 py-16 text-center">
        <h2 className="text-3xl font-semibold">Stay Updated</h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Subscribe to get special offers and updates
        </p>

        <form className="mt-6 flex justify-center gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-64 rounded-lg border px-4 py-2 text-black"
          />
          <button className="rounded-lg bg-black px-6 py-2 text-white dark:bg-white dark:text-black">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
