"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Your cart is empty 🛒</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-xl shadow mb-4"
        >
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-zinc-500">
              ${item.price} × {item.quantity}
            </p>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-10 text-right">
        <p className="text-xl font-semibold">Total: ${total}</p>
      </div>
    </div>
  );
}
