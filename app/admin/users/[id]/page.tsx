"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById } from "@/api/user";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  ArrowLeft, 
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function UserDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await getUserById(token, id as string);
        setUser(res.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load user details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUserDetails();
  }, [id, router]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!user) return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
      <Link href="/admin/users" className="text-blue-600 hover:underline mt-2 inline-block">
        Go back to user list
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/users"
          className="p-2 hover:bg-white rounded-xl transition border border-transparent hover:border-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <p className="text-sm text-gray-500">Overview of user personal and account information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-4xl font-bold text-indigo-600">
                  {user.name.charAt(0)}
                </div>
                <div className="absolute bottom-1 right-1">
                  <span className={`flex h-4 w-4 rounded-full border-2 border-white ${
                    user.status === 1 ? "bg-green-500" : "bg-gray-400"
                  }`}></span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={14} />
                  {user.email}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    user.status === 1 
                    ? "bg-green-50 text-green-600 border border-green-100" 
                    : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    {user.status === 1 ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Role</span>
                  <div className="flex items-center gap-1.5 font-medium text-gray-900 capitalize">
                    {user.role === 'admin' ? <Shield size={14} className="text-blue-600" /> : <User size={14} className="text-gray-400" />}
                    {user.role}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Joined</span>
                  <span className="font-medium text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="text-sm font-bold text-gray-900 mb-4 font-uppercase tracking-wider">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900">{user.mobile || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h4 className="font-bold text-gray-900">Recent Activity</h4>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
            </div>
            
            <div className="divide-y divide-gray-50">
              {/* Placeholder for real activity data */}
              <div className="p-6 flex gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Account Created</p>
                  <p className="text-xs text-gray-500">System generated welcome email sent successfully.</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                    {new Date(user.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="p-6 flex gap-4 opacity-50">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">No Recent Orders</p>
                  <p className="text-xs text-gray-500">This user hasn't placed any orders yet.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account Status</p>
                <p className="text-2xl font-bold text-gray-900">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
