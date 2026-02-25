import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/api/categories";
import { API_URL } from "@/api/Axois";
import { Category } from "@/app/components/admin/CategoryModal";

export default async function CategoriesSection() {
  const categories = await getCategories();
  console.log(categories);
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-3xl font-semibold mb-10">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category: Category) => {
          const baseUrl = API_URL.replace("/api", "");
          const imagePath = category.images
            ? `${baseUrl}/${category.images.replace(/\\/g, "/")}`
            : "/categories/default.png";

          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group rounded-xl bg-white dark:bg-zinc-900 p-6 text-center shadow hover:shadow-lg transition"
            >
              <div className="relative mx-auto h-24">
                <Image
                  src={imagePath}
                  alt={category.name}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>

              <p className="mt-4 font-medium group-hover:underline">
                {category.name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
