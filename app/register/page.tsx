"use client";

import { registerUser } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e: any) => {
    e.preventDefault();
    await registerUser(form);
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Name"
          className="w-full border p-3"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          className="w-full border p-3"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-black text-white p-3">
          Register
        </button>
      </form>
    </div>
  );
}
