import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/components/AddToCartButton";
import { getProductById } from "@/api/products";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  const imageUrl =
    product.image && product.image.trim() !== ""
      ? `http://localhost:3001/uploads/${product.image}`
      : "/products/default.png";

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-zinc-500">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/products" className="hover:underline">
            Products
          </Link>{" "}
          /{" "}
          <span className="text-zinc-800 dark:text-zinc-200">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* IMAGE */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-10 shadow">
            <div className="relative h-[420px] w-full">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
              ${product.price}
            </p>

            <p className="mt-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This is a premium quality product designed to give you the best
              shopping experience. Durable, stylish, and value for money.
            </p>

            {/* ACTIONS */}
            <div className="mt-8 flex gap-4">
              <AddToCartButton product={product} />

              <Link
                href="/products"
                className="rounded-lg border border-zinc-300 px-8 py-3"
              >
                Back to Products
              </Link>
            </div>

            {/* EXTRA INFO */}
            <div className="mt-10 border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <p>✔ Free shipping available</p>
              <p>✔ 7-day replacement guarantee</p>
              <p>✔ Secure payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
