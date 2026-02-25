import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/api/products";
import { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SimilarProductsProps {
    currentProductId: number;
    categoryId: number;
}

export default async function SimilarProducts({ currentProductId, categoryId }: SimilarProductsProps) {
    const allProducts = await getProducts();

    // Filter similar products by category, excluding the current product
    const similarProducts = allProducts
        .filter((p) => p.category_id === categoryId && p.id !== currentProductId)
        .slice(0, 4); // Show up to 4 similar products

    if (similarProducts.length === 0) return null;

    return (
        <section className="mt-20">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">
                Similar Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {similarProducts.map((product: Product) => {
                    const imageUrl =
                        product?.images && product.images.trim() !== ""
                            ? `${API_URL?.replace("/api", "")}/${product.images.split(",")[0].replace(/\\/g, "/")}`
                            : "https://argento-m2.swissupdemo.com/media/catalog/product/cache/008f094270e752a24599ac3fd36e2e5c/5/1/51sdsgpapwl.jpg.webp";

                    return (
                        <div
                            key={product.id}
                            className="group rounded-xl bg-white dark:bg-zinc-900 shadow hover:shadow-lg transition"
                        >
                            <Link href={`/products/${product.id}`}>
                                <div className="relative h-64 w-full">
                                    <Image
                                        src={imageUrl}
                                        alt={product.name}
                                        fill
                                        unoptimized
                                        className="object-cover rounded-t-xl"
                                    />
                                </div>
                            </Link>

                            <div className="p-5">
                                <Link href={`/products/${product.id}`}>
                                    <h3 className="font-medium group-hover:text-blue-600 transition truncate">
                                        {product.name}
                                    </h3>
                                </Link>

                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                    ₹ {product.price}
                                </p>

                                <Link
                                    href={`/products/${product.id}`}
                                    className="mt-4 inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
