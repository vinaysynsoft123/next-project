"use client";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="rounded-lg bg-black px-8 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
    >
      Add to Cart
    </button>
  );
}
