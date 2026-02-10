import { API_URL } from "@/api/Axois";

export async function placeOrder(token: string, payload: {
  address_id: number;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  payment_method?: string;
}) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}

export async function getOrderDetails(token: string, id: number) {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch order details");
  return res.json();
}


export async function getAllOrdersAdmin(token: string) {
  const res = await fetch(`${API_URL}/orders/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}