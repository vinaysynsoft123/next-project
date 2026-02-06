"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { verifyPayment } from "@/api/payment";

type StripePaymentFormProps = {
  clientSecret: string;
  transactionId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function StripePaymentForm({ clientSecret, transactionId, onSuccess, onCancel }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        // Verify with our backend
        const token = localStorage.getItem("token");
        if (token) {
          await verifyPayment(token, transactionId);
          onSuccess();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#111827",
                "::placeholder": {
                  color: "#9ca3af",
                },
              },
            },
          }}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-black cursor-pointer text-white py-4 rounded-2xl font-extrabold shadow-xl shadow-black/10 disabled:opacity-50 active:scale-[0.98] transition-all"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          ) : (
            "Pay Securely Now"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 bg-gray-100 cursor-pointer text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
