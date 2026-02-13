"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    getCompanySettings,
    updateCompanySettings,
    addCompanySettings,
} from "@/api/company_settings";
import toast from "react-hot-toast";

export default function SettingsPage() {

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [errors, setErrors] = useState<any>({
        companyName: "",
        email: "",
        phone: "",
        city: "",
    });

    const [companySettings, setCompanySettings] = useState<any>({
        id: "",
        companyName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstNumber: "",
        panNumber: "",
        logoUrl: "",
    });


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setCompanySettings({
            ...companySettings,
            [name]: value,
        });


        if (errors[name]) {
            setErrors((prev: any) => ({
                ...prev,
                [name]: "",
            }));
        }
    };


    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const preview = URL.createObjectURL(file);
            setLogoPreview(preview);
        }
    };

    const validate = () => {
        const newErrors: any = {};

        if (!companySettings.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }

        if (!companySettings.email.trim()) {
            newErrors.email = "Email is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(companySettings.email)) {
                newErrors.email = "Invalid email format";
            }
        }

        if (!companySettings.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        if (!companySettings.city.trim()) {
            newErrors.city = "City is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You are not logged in");
            return;
        }

        const formData = new FormData();
        const { id, ...rest } = companySettings;

        Object.entries(rest).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        if (selectedFile) {
            formData.append("logo", selectedFile);
        }

        try {
            if (companySettings.id) {
                await updateCompanySettings(token, companySettings.id, formData);
                toast.success("Settings updated successfully!");
            } else {
                const newSettings = await addCompanySettings(token, formData);
                toast.success("Settings created successfully!");
                if (newSettings?.id) {
                    setCompanySettings({ ...companySettings, id: newSettings.id });
                }
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        }
    };

    /* ---------------- FETCH ---------------- */
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await getCompanySettings(token);
            if (res) {
                setCompanySettings(res);
                if (res.logoUrl) {
                    let logoPath = res.logoUrl;
                    // If it's already a full URL or blob, use it directly
                    if (logoPath.startsWith("http") || logoPath.startsWith("blob:")) {
                        setLogoPreview(logoPath);
                    } else {
                        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://localhost:3001";
                        const path = logoPath.replace(/\\/g, "/");
                        const cleanPath = path.startsWith("/") ? path : `/${path}`;
                        setLogoPreview(`${baseUrl}${cleanPath}`);
                    }
                }
            }
        } catch {
            toast.error("Failed to load settings");
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="max-w-5xl">
            <h1 className="text-2xl font-bold mb-6">Company Settings</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-sm border space-y-8"
            >
                {/* Logo */}
                <div>
                    <label className="block font-medium mb-2">Company Logo</label>
                    <div className="flex items-center gap-6">
                        {logoPreview ? (
                            <Image
                                src={logoPreview}
                                alt="Logo Preview"
                                width={100}
                                height={100}
                                className="rounded-lg border object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg border">
                                No Logo
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleLogoChange} />
                    </div>
                </div>

                {/* ALL FIELDS */}
                <div className="grid grid-cols-2 gap-6">
                    {[
                        "companyName",
                        "email",
                        "phone",
                        "alternatePhone",
                        "city",
                        "state",
                        "pincode",
                        "gstNumber",
                        "panNumber",
                    ].map((field) => (
                        <div key={field}>
                            <input
                                type="text"
                                name={field}
                                placeholder={field}
                                value={companySettings[field]}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg ${errors[field] ? "border-red-500" : ""
                                    }`}
                            />
                            {errors[field] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors[field]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Address */}
                <textarea
                    name="address"
                    rows={3}
                    placeholder="Address"
                    value={companySettings.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
