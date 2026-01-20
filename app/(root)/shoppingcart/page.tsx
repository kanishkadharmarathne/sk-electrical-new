// Step 1: Create Cart Page Component
// File: src/app/cart/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {useSession} from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

interface CartItem {
  productId: string;
  productname: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
  inStock: boolean;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: string;
}

export default function CartPage() {
  const {status} = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    if (status == "loading") return;

    if(status == "unauthenticated"){
      router.push("/api/auth/signin");
      return;
    }else{
      fetchCart();
    }
    
  }, [status, router]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/api/auth/signin");
          return;
        }
        throw new Error(data.error || "Failed to fetch cart");
      }

      setCart(data.cart);
    } catch (error: any) {
      setError(error.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return;

    setUpdatingItems((prev) => new Set(prev).add(productId));

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update quantity");
      }

      setCart(data.cart);
    } catch (error: any) {
      setError(error.message || "Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove item");
      }

      setCart(data.cart);
    } catch (error: any) {
      setError(error.message || "Failed to remove item");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your entire cart?")) return;

    setLoading(true);

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to clear cart");
      }

      setCart(data.cart);
    } catch (error: any) {
      setError(error.message || "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError("");

      // First create order from cart
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress: "",
          shippingCity: "",
          shippingState: "",
          shippingZipCode: "",
          shippingCountry: "",
          phoneNumber: "",
          paymentMethod: "",
        }),
      });

      const orderData = await orderResponse.json();

      // If order creation fails, show error
      if (!orderResponse.ok) {
        setError(orderData.error || "Failed to create order");
        setLoading(false);
        return;
      }

      // Successfully created order, redirect to checkout with order ID
      router.push(`/checkout/${orderData.order._id}`);
    } catch (error: any) {
      setError(error.message || "Failed to proceed to checkout");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart?.items?.length || 0} item
            {(cart?.items?.length || 0) !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          // Cart Content
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="border-b last:border-b-0 p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.productname}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-blue-600">
                            Rs {parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>

                        {/* Stock Status */}
                        <p className="text-sm mb-4">
                          <span
                            className={`inline-block px-2 py-1 rounded ${
                              item.inStock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                updatingItems.has(item.productId) ||
                                item.quantity <= 1
                              }
                              className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 font-semibold text-gray-900 min-w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              disabled={updatingItems.has(item.productId)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="ml-auto text-right">
                            <p className="text-sm text-gray-600">Subtotal</p>
                            <p className="text-lg font-bold text-gray-900">
                              Rs
                               {(parseFloat(item.price) * item.quantity).toFixed(
                                2
                              )}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            disabled={updatingItems.has(item.productId)}
                            className="text-red-600 hover:text-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  href="/products"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                >
                  <span>← Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      Rs {parseFloat(cart.totalPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-900">
                      Rs 0.00 (Free)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">
                      Rs {(parseFloat(cart.totalPrice) * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      Rs{(parseFloat(cart.totalPrice) * 1.1).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Including 10% tax
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3"
                >
                  Proceed to Checkout
                </button>

                {/* Clear Cart Button */}
                <button
                  onClick={handleClearCart}
                  className="w-full border border-red-600 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Free Shipping!</span> on all
                    orders over Rs 50
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
