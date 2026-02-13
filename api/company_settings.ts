
import { API_URL } from "@/api/Axois";

export async function getCompanySettings(token: string) {

    const res = await fetch(`${API_URL}/company-settings`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to fetch company settings");
    return data;
}

export async function updateCompanySettings(token: string, id: string, data: any) {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API_URL}/company-settings`, {
        method: "PUT",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization: `Bearer ${token}`,
        },
        body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update company settings");
    return res.json();
}

export async function addCompanySettings(token: string, data: any) {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API_URL}/company-settings`, {
        method: "POST",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization: `Bearer ${token}`,
        },
        body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add company settings");
    return res.json();
}


