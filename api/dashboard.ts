import { API_URL } from "@/api/Axois";

export async function getDashboardStats(token: string) {
    const res = await fetch(`${API_URL}/dashboard/stats`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
}
