"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle, Home } from "lucide-react";
import toast from "react-hot-toast";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "@/api/address";

export default function AddressSection() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip_code:  "", 
    country: "India",
    is_default: false,
  });

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await getAddresses(token);
      setAddresses(response.data || []);
    } catch (err: any) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const validateForm = () => {
    if (!form.address_line1.trim()) return "Address Line 1 is required";
    if (!form.city.trim()) return "City is required";
    if (!form.state.trim()) return "State is required";
    if (!form.zip_code.trim()) return "Zip Code is required";
    if (!form.country.trim()) return "Country is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      if (editingId) {
        await updateAddress(token, editingId, form);
        toast.success("Address updated successfully");
      } else {
        await addAddress(token, form);
        toast.success("Address added successfully");
      }
      resetForm();
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || "Failed to save address");
    }
  };

  const resetForm = () => {
    setForm({
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "India",
      is_default: false,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (addr: any) => {
    setForm({
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || "",
      city: addr.city,
      state: addr.state,
      zip_code: addr.zip_code,
      country: addr.country,
      is_default: addr.is_default === 1,
    });
    setEditingId(addr.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await deleteAddress(token, id);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err: any) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (addr: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await updateAddress(token, addr.id, { ...addr, is_default: true });
      toast.success("Primary address updated");
      fetchAddresses();
    } catch (err: any) {
      toast.error("Failed to update primary address");
    }
  };

  if (loading) return <div className="text-center py-10">Loading addresses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
          >
            <Plus size={18} /> Add New Address
          </button>
        )}
      </div>

      {(isAdding || editingId) ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold">{editingId ? "Edit Address" : "Add New Address"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Address Line 1</label>
              <input
                type="text"
                placeholder="House No, Street, Area"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none transition"
                value={form.address_line1}
                onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                placeholder="Apartment, Landmark, etc."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none transition"
                value={form.address_line2}
                onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">City</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none transition"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">State</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none transition"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Zip Code</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none transition"
                value={form.zip_code}
                onChange={(e) => setForm({ ...form, zip_code: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Country</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none transition"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="is_default"
              className="w-4 h-4 accent-black"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
            />
            <label htmlFor="is_default" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Set as primary address</label>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10">
              {editingId ? "Update Address" : "Save Address"}
            </button>
            <button type="button" onClick={resetForm} className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.length === 0 ? (
            <div className="md:col-span-2 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium text-lg">You haven't added any addresses yet.</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} className={`p-5 rounded-2xl border transition-all ${addr.is_default ? "border-black bg-white shadow-md ring-1 ring-black/5" : "border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${addr.is_default ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-400"}`}>
                      <Home size={18} />
                    </div>
                    {addr.is_default === 1 && (
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-full">Primary</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(addr)} className="p-2 text-gray-400 hover:text-black transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-400 hover:text-red-600 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900">{addr.address_line1}</p>
                  {addr.address_line2 && <p className="text-gray-600 text-sm">{addr.address_line2}</p>}
                  <p className="text-gray-600 text-sm">{addr.city}, {addr.state} - {addr.zip_code}</p>
                  <p className="text-gray-500 text-xs font-bold uppercase mt-2">{addr.country}</p>
                </div>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    className="mt-4 text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1 transition-colors"
                  >
                    Set as Primary
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
