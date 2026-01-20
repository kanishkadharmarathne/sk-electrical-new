// File: src/app/admin/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Package, ShoppingCart, Camera } from "lucide-react";
import ProductsTab from "../components/ProductsTab";
import OrdersTab from "../components/OrdersTab";
import PackagesTab from "../components/PackagesTab";
import BookingTab from "./BookingTab";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<
    "products" | "orders" | "packages" | "booking"
  >("products");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalPackages: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products count
      const productsRes = await fetch("/api/products");
      const productsData = await productsRes.json();
      
      // Fetch orders count
      const ordersRes = await fetch("/api/admin/orders");
      const ordersData = await ordersRes.json();
      
      // Fetch packages count
      const packagesRes = await fetch("/api/cctv-packages");
      const packagesData = await packagesRes.json();

      setStats({
        totalProducts: productsData.products?.length || 0,
        totalOrders: ordersData.orders?.length || 0,
        totalPackages: packagesData.packages?.length || 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // Refresh stats when tab changes
  const handleTabChange = (tab: "products" | "orders" | "packages"| "booking") => {
    setActiveTab(tab);
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage products, orders, and packages</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-2">
            <button
              onClick={() => handleTabChange("products")}
              className={`px-4 py-3 font-semibold rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ADB5] ${
                activeTab === "products"
                  ? "border-b-4 border-[#00ADB5] text-[#00ADB5] bg-[#00ADB5]/5"
                  : "border-b-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Package size={20} />
                <span>Products</span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "products"
                      ? "bg-[#00ADB5]/20 text-[#00ADB5]"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {stats.totalProducts}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange("orders")}
              className={`px-4 py-3 font-semibold rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ADB5] ${
                activeTab === "orders"
                  ? "border-b-4 border-[#00ADB5] text-[#00ADB5] bg-[#00ADB5]/5"
                  : "border-b-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} />
                <span>Orders</span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "orders"
                      ? "bg-[#00ADB5]/20 text-[#00ADB5]"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {stats.totalOrders}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange("packages")}
              className={`px-4 py-3 font-semibold rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ADB5] ${
                activeTab === "packages"
                  ? "border-b-4 border-[#00ADB5] text-[#00ADB5] bg-[#00ADB5]/5"
                  : "border-b-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Camera size={20} />
                <span>CCTV Packages</span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "packages"
                      ? "bg-[#00ADB5]/20 text-[#00ADB5]"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {stats.totalPackages}
                </span>
              </div>
            </button>

             <button
              onClick={() => handleTabChange("booking")}
              className={`px-4 py-3 font-semibold rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ADB5] ${
                activeTab === "booking"
                  ? "border-b-4 border-[#00ADB5] text-[#00ADB5] bg-[#00ADB5]/5"
                  : "border-b-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Camera size={20} />
                <span>Booking</span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "booking"
                      ? "bg-[#00ADB5]/20 text-[#00ADB5]"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {stats.totalPackages}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === "products" && <ProductsTab onUpdate={fetchStats} />}
        {activeTab === "orders" && <OrdersTab onUpdate={fetchStats} />}
        {activeTab === "packages" && <PackagesTab onUpdate={fetchStats} />}
        {activeTab === "booking" && <BookingTab />}
      </div>
    </div>
  );
}