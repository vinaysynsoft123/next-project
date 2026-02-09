// api/categories.ts
import { API_URL } from "@/api/Axois";


export async function getCategories(): Promise<any> {
  const res = await fetch(`${API_URL}/categories`, {
    cache: "no-store", // always fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const response = await res.json();
  return response.data;
}
