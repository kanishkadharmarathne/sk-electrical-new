"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  productId: string;
  productname: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: string;
  tax: string;
  shippingCost: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZipCode?: string;
  shippingCountry?: string;
  phoneNumber?: string;
  paymentMethod?: string;
  notes?: string;
  trackingNumber?: string;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/orders/${orderId}`, {
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
        throw new Error(data.error || "Failed to fetch order");
      }

      setOrder(data.order);
    } catch (error: any) {
      setError(error.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">✕</div>
          <p className="text-gray-900 font-semibold text-lg mb-2">
            Error Loading Order
          </p>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const grandTotal =
    parseFloat(order?.totalPrice || "0") +
    parseFloat(order?.tax || "0") +
    parseFloat(order?.shippingCost || "0");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-600 text-lg">
            Your order has been successfully placed and confirmed.
          </p>
        </div>

        {/* Order Confirmation Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Order Number Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 text-white">
            <p className="text-sm font-medium mb-1">Order Number</p>
            <p className="text-3xl font-bold break-all">{order?._id}</p>
            <p className="text-sm text-green-100 mt-2">
              Confirmation email has been sent to your email address
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            {/* Order Status Timeline */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Order Status
              </h2>

              <div className="space-y-4">
                {/* Status Item - Confirmed */}
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                      ✓
                    </div>
                    <div className="w-1 h-12 bg-gray-300 my-1"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order?.createdAt || "").toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Status Item - Processing */}
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                      ⏳
                    </div>
                    <div className="w-1 h-12 bg-gray-300 my-1"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">
                      Your order is being prepared for shipment
                    </p>
                  </div>
                </div>

                {/* Status Item - Shipped */}
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                      📦
                    </div>
                    <div className="w-1 h-12 bg-gray-300 my-1"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Shipped</p>
                    <p className="text-sm text-gray-600">
                      We'll notify you when your order ships
                    </p>
                  </div>
                </div>

                {/* Status Item - Delivered */}
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                      ✓
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Delivered</p>
                    <p className="text-sm text-gray-600">
                      Your order will arrive soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>

              <div className="space-y-4">
                {order?.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {/* <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      /> */}
                    </div>

                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.productname}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          Rs {parseFloat(item.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Rs {(parseFloat(item.price) * item.quantity).toFixed(2)}{" "}
                          total
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{order?.shippingAddress}</p>
                <p className="text-gray-900">
                  {order?.shippingCity}, {order?.shippingState}{" "}
                  {order?.shippingZipCode}
                </p>
                <p className="text-gray-900">{order?.shippingCountry}</p>
                <p className="text-gray-900 mt-2">Phone: {order?.phoneNumber}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>

              <p className="text-gray-900 capitalize">
                {order?.paymentMethod?.replace("-", " ")}
              </p>

              <div className="mt-2 inline-block px-3 py-1 bg-green-100 rounded-full">
                <p className="text-sm text-green-800 font-medium">
                  {order?.paymentStatus === "completed" ? "✓ Paid" : "Pending"}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    Rs {parseFloat(order?.totalPrice || "0").toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    Rs {parseFloat(order?.shippingCost || "0").toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">
                    Rs {parseFloat(order?.tax || "0").toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    Rs {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {order?.notes && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Order Notes</h3>
                <p className="text-blue-800">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* What's Next */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold text-gray-900">What's Next?</h3>
            </div>
            <p className="text-sm text-gray-600">
              We're preparing your order. You'll receive a shipping notification
              with tracking information soon.
            </p>
          </div>

          {/* Track Order */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9-4v4m0 0v4m0-4h4m-4 0H9"
                />
              </svg>
              <h3 className="font-semibold text-gray-900">Track Order</h3>
            </div>
            <p className="text-sm text-gray-600">
              Visit your account to track your order status and get real-time
              updates.
            </p>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5-4a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
            </div>
            <p className="text-sm text-gray-600">
              Check our FAQ or contact customer support if you have any
              questions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            View My Orders
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9.162-9.162a2 2 0 00-2.828-2.828L12 13.172l-6.334-6.334a2 2 0 00-2.828 2.828L12 19z"
              />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
          <p>
            A confirmation email has been sent to your email address. If you
            don't see it, check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}