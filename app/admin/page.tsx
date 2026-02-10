"use client";

import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/api/dashboard";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminDashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getDashboardStats(token);
        setStatsData(res.data);
      } catch (err: any) {
        toast.error("Failed to load dashboard stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { 
      label: "Total Revenue", 
      value: `₹${statsData?.totalRevenue?.toLocaleString() || '0'}`, 
      change: "+12.5%", 
      isPositive: true, 
      icon: TrendingUp,
      color: "blue" 
    },
    { 
      label: "Total Users", 
      value: statsData?.totalUsers?.toString() || '0', 
      change: "+18.1%", 
      isPositive: true, 
      icon: Users,
      color: "green" 
    },
    { 
      label: "Total Orders", 
      value: statsData?.totalOrders?.toString() || '0', 
      change: "+19.2%", 
      isPositive: true, 
      icon: ShoppingCart,
      color: "purple" 
    },
    { 
      label: "Total Products", 
      value: statsData?.totalProducts?.toString() || '0', 
      change: "+5.4%", 
      isPositive: true, 
      icon: Package,
      color: "orange" 
    },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Loading dashboard metrics...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Here's a breakdown of your store's performance.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm border border-blue-100 uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
          Live Data
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon size={26} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{stat.value}</p>
            
            {/* Subtle background decoration */}
            <div className={`absolute -bottom-6 -right-6 text-${stat.color}-500 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`}>
              <stat.icon size={120} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
            <Link 
              href="/admin/orders"
              className="text-sm cursor-pointer font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition"
            >
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase font-black tracking-widest">
                  <th className="pb-4">Transaction</th>
                  <th className="pb-4">User</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Amout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {statsData?.recentOrders?.length > 0 ? (
                  statsData.recentOrders.map((order: any) => (
                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-black group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors uppercase">
                            {order.order_id?.substring(0, 2) || '#'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">#{order.order_id}</p>
                            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{order.user_name}</span>
                      </td>
                      <td className="py-5">
                        <span className={`flex items-center gap-1.5 text-xs font-black capitalize ${
                          order.status === 'completed' || order.status === 'paid' || order.status === 'processing'
                          ? 'text-green-600' 
                          : order.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                             order.status === 'completed' || order.status === 'paid' || order.status === 'processing'
                             ? 'bg-green-500' 
                             : order.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                          }`}></div>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-5 text-sm text-right font-black text-gray-900">₹{order.total_amount?.toLocaleString() || '0'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-400 font-medium">No recent transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Inventory Status</h3>
          <div className="space-y-6">
            {statsData?.lowStockProducts?.length > 0 ? (
              statsData.lowStockProducts.map((product: any, i: number) => (
                <div key={i} className="group flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center group-hover:bg-orange-50 transition border border-gray-50">
                    {product.images ? (
                      <img 
                        src={`${API_URL?.replace("/api", "")}/${product.images.replace(/\\/g, "/")}`} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">In Stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-blue-600">₹{product.price?.toLocaleString()}</p>
                    <p className="text-[10px] text-green-600 font-bold">+Live</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 font-medium italic">
                No products found
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl shadow-gray-200 uppercase tracking-widest text-xs">
            Manage Inventory
          </button>
        </div>
      </div>
    </div>
  );
}

