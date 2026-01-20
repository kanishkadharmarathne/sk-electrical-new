"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface AddToCartButtonProps {
  product: {
    _id: any;
    productname: string;
    title: string;
    price: string;
    image: string;
    inStock: boolean;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id.toString(),
          productname: product.productname,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
          inStock: product.inStock,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          signIn("google");
          return;
        }
        throw new Error(data.error || "Failed to add to cart");
      }

      setMessage("✓ Added to cart!");

      // Navigate to the cart page after a short delay so the user sees the message
      setTimeout(() => {
        setMessage("");
        router.push("/shoppingcart");
      }, 700);
    } catch (error: any) {
      setMessage(error.message || "Failed to add to cart");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || loading}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            product.inStock && !loading
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading
            ? "Adding..."
            : product.inStock
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
        {/* <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button> */}
      </div>
      {message && (
        <p
          className={`mt-2 text-sm font-medium ${
            message.includes("✓") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
