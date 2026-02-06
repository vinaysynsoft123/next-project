import { API_URL } from "@/api/Axois";

export async function initiatePayment(token: string, orderId: number) {
  const res = await fetch(`${API_URL}/payments/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order_id: orderId }),
  });
  if (!res.ok) throw new Error("Payment initiation failed");
  return res.json();
}

export async function verifyPayment(token: string, transactionId: string) {
  const res = await fetch(`${API_URL}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ transaction_id: transactionId }),
  });
  if (!res.ok) throw new Error("Payment verification failed");
  return res.json();
}
