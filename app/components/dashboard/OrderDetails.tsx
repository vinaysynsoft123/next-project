"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Calendar, ShoppingBag } from "lucide-react";
import { getOrderDetails } from "@/api/order";
import toast from "react-hot-toast";
import { API_URL } from "@/api/Axois";

type OrderDetailsProps = {
  orderId: number;
  onBack: () => void;
};

export default function OrderDetailsSection({ orderId, onBack }: OrderDetailsProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await getOrderDetails(token, orderId);
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [orderId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Fetching order details...</p>
    </div>
  );

  if (!order) return <div className="text-center py-20">Order not found.</div>;
  const paymentLabel =
    order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment";
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform cursor-pointer" /> Back to My Orders
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Order #{order.order_id || order.id}</h2>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Calendar size={14} />
              {new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: "long" })}
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === "delivered" ? "bg-green-100 text-green-700" :
              order.status === "pending" ? "bg-amber-100 text-amber-700" :
                "bg-blue-100 text-blue-700"
              }`}>
              {order.status}
            </span>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Amount</p>
          <p className="text-3xl font-black text-black font-mono mt-1">${order.total_amount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
              <ShoppingBag size={20} className="text-gray-400" />
              <h3 className="font-bold">Order Items ({order.items?.length})</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-6 flex items-center gap-4 group">

                  {item.images ? (
                    <Image
                      src={`${API_URL?.replace("/api", "")}/${item.images.split(",")[0].replace(/\\/g, "/")}`}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="object-cover rounded-2xl"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                      <Package size={24} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                  </div>
                  <p className="font-black text-gray-900 font-mono">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <Truck size={18} className="text-gray-400" />
              <h3>Shipping Details</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900">{order.address_line1}</p>
              <p className="text-sm text-gray-600">{order.city}, {order.state}</p>
              <p className="text-sm text-gray-600">{order.country} - {order.zip_code}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <CreditCard size={18} className="text-gray-400" />
              <h3>Payment Method</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-gray-400">
                <Truck size={16} />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">{order.payment_method}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{paymentLabel}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
