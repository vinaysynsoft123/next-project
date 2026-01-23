// api/categories.ts
export type Category = {
  id: number;
  name: string;
  status: string;
  slug: string;
    image: string | null;
};

const API_URL = "http://localhost:3001/api";

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    cache: "no-store", // always fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}
