"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getProfile, updateProfile, getUserOrders } from "@/api/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DashboardSidebar from "@/app/components/dashboard/Sidebar";
import AddressSection from "@/app/components/dashboard/AddressSection";
import OrderDetailsSection from "@/app/components/dashboard/OrderDetails";
import { ShoppingCart, DollarSign, Heart, Package, Clock, Eye } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!authLoading && user?.role === "Admin") {
      router.replace("/admin");
    }
  }, [user, authLoading, router]);
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "orders" | "address" | "wishlist">("overview");
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updateForm, setUpdateForm] = useState({ name: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access this page");
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const profileResponse = await getProfile(token);
        setProfile(profileResponse.data);
        setUpdateForm({
          name: profileResponse.data.name,
          email: profileResponse.data.email,
          mobile: profileResponse.data.mobile,
        });

        const ordersResponse = await getUserOrders(token);
        setOrders(ordersResponse.data || []);
      } catch (err: any) {
        toast.error("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    // Manual Validation
    if (!updateForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!updateForm.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(updateForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (updateForm.mobile && !/^\d{10,15}$/.test(updateForm.mobile)) {
      toast.error("Please enter a valid mobile number (10-15 digits)");
      return;
    }

    try {
      await updateProfile(token, updateForm);
      setProfile({ ...profile, ...updateForm });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error("Update failed: " + (err.message || "Unknown error"));
    }
  };

  // Calculate Stats
  const stats = {
    totalOrders: orders.length,
    totalSpent: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((acc, o) => acc + parseFloat(o.total_amount), 0)
      .toFixed(2),
    wishlistCount: 5, // Placeholder
    pendingOrders: orders.filter((o) => o.status === "pending").length,
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome, {profile?.name}</h1>
            <p className="text-gray-500 mt-1">Manage your orders and account settings</p>
          </div>
          <button
            onClick={() => {
              logout();
              toast.success("Logged out successfully");
              router.push("/login");
            }}
            className="bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Component */}
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">

            {/* STATS GRID - Always visible on Overview or relevant on top */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: "Total Orders", value: stats.totalOrders, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Total Spent", value: `$${stats.totalSpent}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Wishlist", value: stats.wishlistCount, icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
                  { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm min-h-[500px]">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Recent Activity</h2>
                  <p className="text-gray-500">Welcome to your dashboard overview. Use the sidebar to navigate through your profile, orders, and addresses.</p>

                  {/* Quick recent orders list simplified */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Latest Orders</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-2 rounded-lg border border-gray-200">
                              <Package size={20} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="font-bold">Order #{order.order_id || order.id}</p>
                              <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${order.total_amount}</p>
                            <p className={`text-xs font-bold uppercase ${order.status === "delivered" ? "text-green-600" : "text-amber-600"
                              }`}>{order.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Account Settings</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-black text-white px-5 cursor-pointer py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Display Name</label>
                        <input
                          type="text"
                          value={updateForm.name}
                          onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                          className="w-full bg-gray-50 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"

                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Email </label>
                        <input
                          type="email"
                          value={updateForm.email}
                          onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                          className="w-full bg-gray-50 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"

                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Mobile </label>
                        <input
                          type="text"
                          value={updateForm.mobile}
                          onChange={(e) => setUpdateForm({ ...updateForm, mobile: e.target.value })}
                          className="w-full bg-gray-50 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"

                        />
                      </div>
                      <div className="md:col-span-2 flex gap-3 pt-4 border-t mt-4">
                        <button type="submit" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 shadow-lg shadow-black/10">
                          Save Update
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-200">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="max-w-xl divide-y divide-gray-100">
                      {[
                        { label: "Full Name", value: profile?.name },
                        { label: "Email Address", value: profile?.email },
                        { label: "Mobile Number", value: profile?.mobile || "Not provided" },
                        { label: "Account Type", value: profile?.role, capitalize: true },
                        { label: "Member Since", value: new Date(profile?.created_at).toLocaleDateString() },
                      ].map((info, idx) => (
                        <div key={idx} className="flex justify-between py-5 first:pt-0">
                          <span className="text-gray-500 font-medium">{info.label}</span>
                          <span className={`font-bold text-gray-900 ${info.capitalize ? 'capitalize' : ''}`}>
                            {info.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  {selectedOrderId ? (
                    <OrderDetailsSection
                      orderId={selectedOrderId}
                      onBack={() => setSelectedOrderId(null)}
                    />
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-8">My Orders</h2>
                      {orders.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                          <Package className="mx-auto text-gray-300 mb-4" size={48} />
                          <p className="text-gray-500 font-medium text-lg">You haven't placed any orders yet.</p>
                          <button onClick={() => router.push('/products')} className="mt-4 text-black font-bold hover:underline">Start Shopping →</button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div
                              key={order.id}
                              onClick={() => setSelectedOrderId(order.id)}
                              className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group cursor-pointer"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                                    <Package className="text-black" size={24} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-lg">Order #{order.order_id || order.id}</h4>
                                    <p className="text-sm text-gray-500 font-medium">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-8">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-400 font-medium">Total Amount</p>
                                    <p className="text-xl font-extrabold text-gray-900">${order.total_amount}</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === "delivered" ? "bg-green-100 text-green-700" :
                                      order.status === "pending" ? "bg-amber-100 text-amber-700" :
                                        "bg-blue-100 text-blue-700"
                                      }`}>
                                      {order.status}
                                    </div>
                                    <Eye className="text-gray-300 group-hover:text-black transition-colors" size={20} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === "address" && (
                <AddressSection />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
