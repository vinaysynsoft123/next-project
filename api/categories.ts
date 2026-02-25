import { API_URL } from "@/api/Axois";
import { Category } from "@/app/components/admin/CategoryModal";


export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const response = await res.json();
  return response.data;
}

export async function createCategory(formData: FormData) {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create category");
  }
  return res.json();
}

export async function updateCategory(id: number, formData: FormData) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update category");
  }
  return res.json();
}

export async function deleteCategory(id: number) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete category");
  }
  return res.json();
}
