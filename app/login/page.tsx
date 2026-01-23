"use client";

import { loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e: any) => {
    e.preventDefault();
    const data = await loginUser(form);
    login(data);
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Email"
          className="w-full border p-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-black text-white p-3">Login</button>
      </form>
    </div>
  );
}
