"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  id: string;
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
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZipCode: "",
    shippingCountry: "",
    phoneNumber: "",
    paymentMethod: "credit-card",
    notes: "",
  });

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
      setFormData((prev) => ({
        ...prev,
        shippingAddress: data.order.shippingAddress || "",
        shippingCity: data.order.shippingCity || "",
        shippingState: data.order.shippingState || "",
        shippingZipCode: data.order.shippingZipCode || "",
        shippingCountry: data.order.shippingCountry || "",
        phoneNumber: data.order.phoneNumber || "",
        paymentMethod: data.order.paymentMethod || "credit-card",
        notes: data.order.notes || "",
      }));
    } catch (error: any) {
      setError(error.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return (
        formData.shippingAddress.trim() !== "" &&
        formData.shippingCity.trim() !== "" &&
        formData.shippingState.trim() !== "" &&
        formData.shippingZipCode.trim() !== "" &&
        formData.shippingCountry.trim() !== "" &&
        formData.phoneNumber.trim() !== ""
      );
    }
    if (step === 2) {
      return formData.paymentMethod !== "";
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      setError("Please fill in all required fields");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) {
      setError("Please select a payment method");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress: formData.shippingAddress,
          shippingCity: formData.shippingCity,
          shippingState: formData.shippingState,
          shippingZipCode: formData.shippingZipCode,
          shippingCountry: formData.shippingCountry,
          phoneNumber: formData.phoneNumber,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          paymentStatus: "completed",
          orderStatus: "confirmed",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete order");
      }

      // Redirect to order confirmation
      router.push(`/order-confirmation/${orderId}`);
    } catch (error: any) {
      setError(error.message || "Failed to complete order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const grandTotal =
    (parseFloat(order?.totalPrice || "0") +
      parseFloat(order?.tax || "0") +
      parseFloat(order?.shippingCost || "0")) *
    100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Step Indicator */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div
                      className={`flex flex-col items-center ${
                        currentStep >= 1 ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          currentStep >= 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        1
                      </div>
                      <p className="text-sm mt-2">Shipping</p>
                    </div>

                    <div
                      className={`flex-1 h-1 mx-4 ${
                        currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />

                    <div
                      className={`flex flex-col items-center ${
                        currentStep >= 2 ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          currentStep >= 2
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        2
                      </div>
                      <p className="text-sm mt-2">Payment</p>
                    </div>

                    <div
                      className={`flex-1 h-1 mx-4 ${
                        currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />

                    <div
                      className={`flex flex-col items-center ${
                        currentStep >= 3 ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          currentStep >= 3
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        3
                      </div>
                      <p className="text-sm mt-2">Review</p>
                    </div>
                  </div>
                </div>

                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Shipping Address
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleInputChange}
                          placeholder="New York"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          name="shippingState"
                          value={formData.shippingState}
                          onChange={handleInputChange}
                          placeholder="NY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="shippingZipCode"
                          value={formData.shippingZipCode}
                          onChange={handleInputChange}
                          placeholder="10001"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="shippingCountry"
                          value={formData.shippingCountry}
                          onChange={handleInputChange}
                          placeholder="United States"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="pt-6 flex justify-end gap-3">
                      <button
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <div className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Payment Method
                    </h2>

                    <div className="space-y-3">
                      {/* Credit Card Option */}
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit-card"
                          checked={formData.paymentMethod === "credit-card"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3">
                          <span className="block font-medium text-gray-900">
                            Credit/Debit Card
                          </span>
                          <span className="text-sm text-gray-500">
                            Visa, Mastercard, American Express
                          </span>
                        </span>
                      </label>

                      {/* PayPal Option */}
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === "paypal"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3">
                          <span className="block font-medium text-gray-900">
                            PayPal
                          </span>
                          <span className="text-sm text-gray-500">
                            Fast and secure payment
                          </span>
                        </span>
                      </label>

                      {/* Bank Transfer Option */}
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank-transfer"
                          checked={formData.paymentMethod === "bank-transfer"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3">
                          <span className="block font-medium text-gray-900">
                            Bank Transfer
                          </span>
                          <span className="text-sm text-gray-500">
                            Direct bank payment
                          </span>
                        </span>
                      </label>
                    </div>

                    {/* Card Details (if credit card selected) */}
                    {formData.paymentMethod === "credit-card" && (
                      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Add any special instructions..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="pt-6 flex justify-between gap-3">
                      <button
                        onClick={handlePreviousStep}
                        className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Review Your Order
                    </h2>

                    {/* Shipping Summary */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Shipping Address
                      </h3>
                      <p className="text-gray-700">{formData.shippingAddress}</p>
                      <p className="text-gray-700">
                        {formData.shippingCity}, {formData.shippingState}{" "}
                        {formData.shippingZipCode}
                      </p>
                      <p className="text-gray-700">{formData.shippingCountry}</p>
                      <p className="text-gray-700">{formData.phoneNumber}</p>
                    </div>

                    {/* Payment Summary */}
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Payment Method
                      </h3>
                      <p className="text-gray-700 capitalize">
                        {formData.paymentMethod.replace("-", " ")}
                      </p>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 mt-1 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the terms and conditions and privacy policy
                      </span>
                    </label>

                    <div className="pt-6 flex justify-between gap-3">
                      <button
                        onClick={handlePreviousStep}
                        className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmitOrder}
                        disabled={submitting}
                        className="px-8 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
                      >
                        {submitting ? "Processing..." : "Place Order"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-96 overflow-y-auto">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        Rs {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      Rs {parseFloat(order.totalPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">
                      Rs {parseFloat(order.shippingCost).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">
                      Rs {parseFloat(order.tax).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      Rs {(grandTotal / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-xs text-blue-900">
                    ✓ Secure checkout with SSL encryption
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