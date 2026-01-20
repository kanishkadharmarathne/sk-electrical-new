"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Camera, Clock, Shield, Zap } from "lucide-react";

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
}

export default function CCTVPackagesPage() {
  const [packages, setPackages] = useState<CCTVPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/cctv-packages");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch packages");
      }

      setPackages(data.packages || []);
    } catch (error: any) {
      setError(error.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    if (filter === "all") return true;
    return pkg.cameras === parseInt(filter);
  });

  const cameraOptions = [
    ...new Set(packages.map((pkg) => pkg.cameras.toString())),
  ].sort((a, b) => parseInt(a) - parseInt(b));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex text-black py-4 justify-center items-center">
        <div className="flex flex-col items-center ax-w-6xl mx-auto px-4  ">
          <h1 className="text-4xl mb-4 ">CCTV Installation Packages</h1>
          <p className="text-sm text-black ">
            Professional security solutions for your home or business
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Filter Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Filter by Camera Count
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
              }`}
            >
              All Packages
            </button>
            {cameraOptions.map((count) => (
              <button
                key={count}
                onClick={() => setFilter(count)}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === count
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                }`}
              >
                <Camera size={18} />
                {count} Cameras
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <Camera size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No packages found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Package Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={pkg.coverImage || pkg.image}
                    alt={pkg.packagename}   
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  
                </div>

                {/* Package Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.packagename}
                  </h3>

                  {/* Short Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {pkg.shortDescription}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.round(pkg.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({pkg.rating}/5)
                    </span>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Camera size={18} className="text-blue-600" />
                      <span className="text-sm">
                        {pkg.cameras} Cameras
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={18} className="text-blue-600" />
                      <span className="text-sm">
                        Installation: {pkg.installationDays} days
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Shield size={18} className="text-blue-600" />
                      <span className="text-sm">Warranty: {pkg.warranty}</span>
                    </div>
                  </div>

                 
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/cctv-packages/${pkg._id}/details`}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/cctv-packages/${pkg._id}/booking`}
                      className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors text-center"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Our CCTV Packages?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Professional Installation
              </h3>
              <p className="text-gray-600 text-sm">
                Expert technicians ensure perfect setup
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Full Warranty Coverage
              </h3>
              <p className="text-gray-600 text-sm">
                Comprehensive protection for your investment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quick Installation
              </h3>
              <p className="text-gray-600 text-sm">
                Minimal downtime with fast setup
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600 text-sm">
                Round-the-clock technical support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}