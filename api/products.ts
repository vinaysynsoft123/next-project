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

export async function createProduct(formData: FormData) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: number, formData: FormData) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete product");
  }
  return res.json();
}
