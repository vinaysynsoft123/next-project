"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderDetailsAdmin, updateOrderStatusAdmin } from "@/api/order";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    CreditCard,
    User,
    MapPin,
    Calendar,
    ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Please login to access this page");
                    router.push("/login");
                    return;
                }

                const res = await getOrderDetailsAdmin(token, id);
                setOrder(res.data);
            } catch (err: any) {
                toast.error("Failed to load order details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id, router]);

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setUpdating(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            await updateOrderStatusAdmin(token, id, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            setOrder({ ...order, status: newStatus });
        } catch (err: any) {
            toast.error("Failed to update status");
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending": return <Clock className="text-amber-500" size={20} />;
            case "processing": return <Package className="text-blue-500" size={20} />;
            case "shipped": return <Truck className="text-indigo-500" size={20} />;
            case "delivered": return <CheckCircle className="text-green-500" size={20} />;
            case "completed": return <CheckCircle className="text-green-600" size={20} />;
            case "cancelled": return <XCircle className="text-red-500" size={20} />;
            default: return <Clock className="text-gray-500" size={20} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
            case "processing": return "bg-blue-50 text-blue-600 border-blue-100";
            case "shipped": return "bg-indigo-50 text-indigo-600 border-indigo-100";
            case "delivered": return "bg-green-50 text-green-600 border-green-100";
            case "completed": return "bg-green-100 text-green-700 border-green-200";
            case "cancelled": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-blue-600 font-medium hover:underline"
                >
                    Go back to list
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_id}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                            <Calendar size={14} />
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updating}
                        className="bg-white border rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Details (Left Col) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-black ">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Package size={20} className="text-blue-600" />
                                Products
                            </h2>
                            <span className="text-gray-500 text-sm font-medium">{order.items?.length} Items</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="p-6 flex items-center gap-6 hover:bg-gray-50/50 transition">
                                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-100">
                                        <Image
                                            src={item.images?.split(",")[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"}
                                            alt={item.product_name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">{item.product_name}</h3>
                                        <p className="text-sm text-gray-500">Unit Price: ${Number(item.price).toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                        <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50/50 flex flex-col items-end gap-2">
                            <div className="flex justify-between w-full max-w-xs text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">${Number(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-xs text-sm text-gray-500">
                                <span>Shipping</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between w-full max-w-xs pt-2 mt-2 border-t border-gray-200 text-lg">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-extrabold text-blue-600">
                                    ${Number(order.total_amount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info (Right Col) */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-black ">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <User size={20} className="text-purple-600" />
                                Customer
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {order.user_name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{order.user_name}</h3>
                                    <p className="text-sm text-gray-500">{order.user_email}</p>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition flex items-center justify-center gap-2">
                                <ExternalLink size={14} />
                                View Customer Profile
                            </button>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-black">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <MapPin size={20} className="text-red-500" />
                                Shipping Info
                            </h2>
                        </div>
                        <div className="p-6 space-y-3">
                            <div>
                                <p className="font-bold text-gray-900 mb-1">{order.user_name}</p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {order.address_line1}<br />
                                    {order.city}, {order.state} {order.zip_code}<br />
                                    {order.country}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-black">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <CreditCard size={20} className="text-green-600" />
                                Payment Method
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border shadow-xs">
                                    <CreditCard size={24} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{order.payment_method}</p>
                                    <p className="text-xs text-green-600 font-medium">Transaction Complete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
