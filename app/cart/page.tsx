"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { 
  Trash2, Plus, Minus, ShoppingBag, ChevronRight, 
  MapPin, CreditCard, CheckCircle, Package, ArrowLeft,
  Truck, ArrowRight
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getAddresses } from "@/api/address";
import { placeOrder } from "@/api/order";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { initiatePayment } from "@/api/payment";
import StripePaymentForm from "@/app/components/cart/StripePaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Step = "cart" | "shipping" | "payment" | "success";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [stripeData, setStripeData] = useState<{ clientSecret: string; transactionId: string } | null>(null);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (step === "shipping") {
      fetchAddresses();
    }
  }, [step]);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login?redirect=/cart");
      return;
    }
    try {
      const res = await getAddresses(token);
      setAddresses(res.data || []);
      const defaultAddr = res.data.find((a: any) => a.is_default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    } catch (err) {
      toast.error("Failed to load addresses");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsPlacingOrder(true);
    try {
      const payload = {
        address_id: selectedAddressId,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        payment_method: paymentMethod
      };

      const res = await placeOrder(token, payload);
      
      if (paymentMethod === "STRIPE") {
        const dbId = res.id;
        const paymentRes = await initiatePayment(token, dbId);
        setStripeData({
          clientSecret: paymentRes.clientSecret,
          transactionId: paymentRes.transactionId
        });
        setPlacedOrderId(res.orderId);
      } else {
        setPlacedOrderId(res.orderId);
        setStep("success");
        clearCart();
        toast.success("Order placed successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Go ahead and explore our latest collections.</p>
        <Link href="/products" className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-12 max-w-3xl mx-auto">
          {[
            { id: "cart", label: "Cart", icon: ShoppingBag },
            { id: "shipping", label: "Shipping", icon: Truck },
            { id: "payment", label: "Payment", icon: CreditCard },
            { id: "success", label: "Success", icon: CheckCircle }
          ].map((s, i) => {
            const isActive = step === s.id;
            const isCompleted = ["cart", "shipping", "payment", "success"].indexOf(step) > i;
            
            return (
              <div key={s.id} className="flex flex-col items-center relative flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isActive ? "bg-black text-white shadow-xl scale-110" : 
                  isCompleted ? "bg-green-500 text-white" : "bg-white text-gray-300 border border-gray-100"
                }`}>
                  <s.icon size={20} />
                </div>
                <span className={`text-xs font-bold mt-2 uppercase tracking-widest ${isActive ? "text-black" : "text-gray-400"}`}>
                  {s.label}
                </span>
                {i < 3 && (
                  <div className="absolute top-6 -right-1/2 w-full h-[2px] bg-gray-100 -z-10" />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* STEP 1: CART REVIEW */}
            {step === "cart" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                  <h2 className="text-2xl font-bold">Review Your Items</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {cart.map((item) => (
                    <div key={item.id} className="p-8 flex items-center gap-6 group">
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-gray-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <Package size={32} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Unit Price: ${item.price}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black rounded-lg transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black rounded-lg transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="font-extrabold text-xl font-mono">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING */}
            {step === "shipping" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Shipping Address</h2>
                    <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-black underline underline-offset-4">
                      Add New Address
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.length === 0 ? (
                      <div className="md:col-span-2 text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <MapPin size={32} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No addresses found. Please add one in your dashboard.</p>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div 
                          key={addr.id} 
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedAddressId === addr.id ? "border-black bg-white ring-4 ring-black/5 shadow-xl" : "border-gray-100 bg-gray-50 hover:bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <CheckCircle size={20} className={selectedAddressId === addr.id ? "text-black" : "text-gray-200"} />
                            {addr.is_default === 1 && <span className="text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5 rounded-full">Primary</span>}
                          </div>
                          <p className="font-bold text-gray-900">{addr.address_line1}</p>
                          <p className="text-sm text-gray-500">{addr.city}, {addr.state}</p>
                          <p className="text-xs text-gray-400 mt-2 font-mono">{addr.zip_code}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setStep("cart")}
                  className="flex cursor-pointer items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors"
                >
                  <ArrowLeft size={18} /> Back to Cart
                </button>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === "payment" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                  <h2 className="text-2xl font-bold mb-8">Payment Method</h2>
                  
                  {stripeData ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-black text-white rounded-2xl flex items-center justify-between font-mono">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Amount to Pay</p>
                          <p className="text-2xl font-black">${total.toFixed(2)}</p>
                        </div>
                        <CreditCard size={32} />
                      </div>
                      <Elements stripe={stripePromise} options={{ clientSecret: stripeData.clientSecret }}>
                        <StripePaymentForm 
                          clientSecret={stripeData.clientSecret}
                          transactionId={stripeData.transactionId}
                          onSuccess={() => {
                            setStep("success");
                            clearCart();
                            toast.success("Payment successful!");
                          }}
                          onCancel={() => setStripeData(null)}
                        />
                      </Elements>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[
                        { id: "COD", label: "Cash on Delivery", desc: "Pay when you receive the package", icon: Truck },
                        { id: "STRIPE", label: "Credit / Debit Card", desc: "Secure online payment via Stripe", icon: CreditCard }
                      ].map((m) => (
                        <div 
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`p-6 rounded-2xl border-2 flex items-center gap-6 transition-all cursor-pointer ${
                            paymentMethod === m.id ? "border-black bg-white shadow-lg ring-4 ring-black/5" : "border-gray-100 bg-gray-50 hover:bg-white"
                          }`}
                        >
                          <div className={`p-4 rounded-xl ${paymentMethod === m.id ? "bg-black text-white" : "bg-white text-gray-400"}`}>
                            <m.icon size={24} />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{m.label}</p>
                            <p className="text-sm text-gray-500">{m.desc}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === m.id ? "border-black bg-black text-white" : "border-gray-300"
                          }`}>
                            {paymentMethod === m.id && <CheckCircle size={14} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {!stripeData && (
                  <button 
                    onClick={() => setStep("shipping")}
                    className="flex cursor-pointer items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors"
                  >
                    <ArrowLeft size={18} /> Back to Shipping
                  </button>
                )}
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === "success" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
                  <CheckCircle size={48} className="text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-gray-900">Order Placed!</h2>
                  <p className="text-gray-500 mt-2 text-lg">Thank you for your purchase. Your order ID is <span className="font-bold text-black font-mono">#{placedOrderId}</span></p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Link href="/dashboard" className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                    Track Order
                  </Link>
                  <Link href="/products" className="bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                    Keep Shopping
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Summary */}
          {step !== "success" && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-32">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-black text-black font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>

                {step === "cart" && (
                  <button 
                    onClick={() => setStep("shipping")}
                    className="w-full bg-black text-white cursor-pointer py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 group active:scale-[0.98]"
                  >
                    Proceed to Shipping <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {step === "shipping" && (
                  <button 
                    onClick={() => setStep("payment")}
                    disabled={!selectedAddressId}
                    className="w-full bg-black text-white cursor-pointer py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
                  >
                    Continue to Payment <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {step === "payment" && (
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-black text-white cursor-pointer py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50 group active:scale-[0.98]"
                  >
                    {isPlacingOrder ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Place Order <Package size={20} className="group-hover:translate-y-[-2px] transition-transform" /></>
                    )}
                  </button>
                )}

                <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                  <Truck size={20} className="text-gray-400 mt-1" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Estimated delivery: <span className="font-bold text-gray-900">3-5 Business Days</span>. 
                    Free shipping and easy 30-day returns.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
