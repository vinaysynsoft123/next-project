import { Product } from "@/types/product";

const API_URL = "http://localhost:3001/api/users";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/product_list`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function getProductById(id: string): Promise<Product> {
  console.log("fetching product by id"); 
  const res = await fetch(`${API_URL}/product/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Product not found");
  }

  return res.json();
}
