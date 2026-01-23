import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/api/categories";

export default async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-3xl font-semibold mb-10">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group rounded-xl bg-white dark:bg-zinc-900 p-6 text-center shadow hover:shadow-lg transition"
          >
            <div className="relative mx-auto h-24 w-24">
              <Image
                src={category.image || "/categories/default.png"}
                alt={category.name}
                fill
                className="object-contain"
              />
            </div>

            <p className="mt-4 font-medium group-hover:underline">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
