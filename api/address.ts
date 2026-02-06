import { API_URL } from "@/api/Axois";

export async function getAddresses(token: string) {
  const res = await fetch(`${API_URL}/addresses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch addresses");
  return res.json();
}

export async function addAddress(token: string, payload: any) {
  const res = await fetch(`${API_URL}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add address");
  return res.json();
}

export async function updateAddress(token: string, id: number, payload: any) {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update address");
  return res.json();
}

export async function deleteAddress(token: string, id: number) {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete address");
  return res.json();
}
