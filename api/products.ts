import { Product } from "@/types/product";
import { API_URL } from "@/api/Axois";



export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const response = await res.json();  
  return response.data;
}


export async function getProductById(id: number): Promise<Product> {
  console.log("fetching product by id"); 
  const res = await fetch(`${API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Product not found");
  }

   const response = await res.json();  
  return response.data;
}
