import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/api/products";

export default async function ProductsPage() {
  const products = await getProducts(); 
  return (
  <div className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white">
    

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold">All Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white dark:bg-zinc-900 shadow hover:shadow-lg transition"
            >
              <img
                src={`https://argento-m2.swissupdemo.com/media/catalog/product/cache/008f094270e752a24599ac3fd36e2e5c/5/1/51sdsgpapwl.jpg.webp`}
                alt="Product 1"
                className="w-full rounded-t-xl"
              />

              <div className="p-5">
                <h3 className="font-medium">{product.name}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  ${product.price}
                </p>

                <Link
                  href={`/products/${product.id}`}
                  className="mt-4 inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
  </div>
  );
}
