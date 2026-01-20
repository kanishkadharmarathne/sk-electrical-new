// File: src/app/(root)/cctv-packages/[packageId]/details/page.tsx

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
// import AddPackageToCartButton from "@/components/AddPackageToCartButton";
import { Shield, Clock, Package, Check, Star, ArrowLeft } from "lucide-react";

interface PackageProduct {
  productId: string;
  productname: string;
  title: string;
  price: string;
  quantity: number;
}

interface CCTVPackage {
  _id: string;
  packagename: string;
  description: string;
  shortDescription: string;
  image: string;
  coverImage: string;
  price: string;
  products: PackageProduct[];
  cameras: number;
  installationDays: number;
  warranty: string;
  features: string[];
  coverage: string;
  rating: number;
  isAvailable: boolean;
  createdAt: string;
}

async function getPackageById(id: string): Promise<CCTVPackage | null> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/cctv-packages/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch package: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data.package;
  } catch (error) {
    console.error("Error fetching package:", error);
    return null;
  }
}

const PackageDetail = async ({ params }: { params: Promise<{ packageId: string }> }) => {
  const { packageId } = await params;

  // Fetch package from API
  const packageData = await getPackageById(packageId);

  // If package not found, show 404
  if (!packageData) {
    notFound();
  }

  // Calculate total value of products
  const totalProductValue = packageData.products.reduce(
    (sum, product) => sum + parseFloat(product.price) * product.quantity,
    0
  );

  const savings = totalProductValue - parseFloat(packageData.price);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/cctv-packages" className="text-blue-600 hover:text-blue-800">
                Packages
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">{packageData.packagename}</li>
          </ol>
        </nav>

        {/* Package Header with Cover Image */}
        {packageData.coverImage && (
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
            <img
              src={packageData.coverImage}
              alt={packageData.packagename}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {packageData.packagename}
                </h1>
                <p className="text-white/90 text-lg">{packageData.shortDescription}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Image & Quick Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                  <img
                    src={packageData.image}
                    alt={packageData.packagename}
                    className="max-h-64 w-full object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(packageData.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-700">
                      {packageData.rating} / 5
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Package size={20} />
                        <span className="text-sm font-medium">Cameras</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {packageData.cameras}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-600 mb-1">
                        <Clock size={20} />
                        <span className="text-sm font-medium">Installation</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {packageData.installationDays} Day{packageData.installationDays > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 col-span-2">
                      <div className="flex items-center gap-2 text-purple-600 mb-1">
                        <Shield size={20} />
                        <span className="text-sm font-medium">Warranty</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {packageData.warranty}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Package
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {packageData.description}
              </p>
              {packageData.coverage && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-gray-900">
                    <span className="font-semibold">Coverage:</span> {packageData.coverage}
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            {packageData.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {packageData.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included Products */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What's Included ({packageData.products.length} Items)
              </h2>
              <div className="space-y-3">
                {packageData.products.map((product) => (
                  <div
                    key={product.productId}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.productname}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Qty: {product.quantity}
                      </p>
                      <p className="font-semibold text-gray-900">
                        Rs {product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & CTA */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              {/* Availability Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      packageData.isAvailable ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-semibold ${
                      packageData.isAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {packageData.isAvailable ? "Available Now" : "Currently Unavailable"}
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-sm text-gray-600 mb-2">Package Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    Rs {packageData.price}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">Save Rs {savings.toFixed(2)}</span>
                      <br />
                      <span className="text-xs">
                        compared to buying items separately
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Link
                  href={`/cctv-packages/${packageData._id}/booking`}
                  className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Book Now
                </Link>
              </div>

              {/* Package Benefits */}
              <div className="space-y-3 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Package Benefits
                </h3>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      Free Installation
                    </h4>
                    <p className="text-xs text-gray-600">
                      Professional setup included
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {packageData.warranty} Warranty
                    </h4>
                    <p className="text-xs text-gray-600">
                      Full coverage on all components
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      Technical Support
                    </h4>
                    <p className="text-xs text-gray-600">
                      24/7 customer assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Packages Button */}
        <div className="mt-8">
          <Link
            href="/cctv-packages"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to All Packages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;