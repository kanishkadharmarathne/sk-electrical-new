import CustomerChatbox from "@/components/customerChatbox";
import { Mail, Package, Phone } from "lucide-react";
import Image from "next/image";
import ProductCard from "./../../components/ProductCard";
import { ProductRepository } from "@/lib/typeorm/repositories/productRepository";
import React from "react";
import { Star, Camera, Clock, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { CCTVPackageRepository } from "@/lib/typeorm/repositories/cctvPackageRepository";

export default async function Home() {
  const posts = await ProductRepository.findTopFour();

  const Packages = await CCTVPackageRepository.findTopThree();

  return (
    <div>
      <div
        style={{
          backgroundImage:
            "url('/hero2.png'),linear-gradient(to right, #0f172a, #1e3a8a, #0891b2)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "550px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(100, 200, 255, 0.3)"
                strokeWidth="1"
              />
            </pattern>
            <linearGradient
              id="lineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(100, 200, 255, 0.5)" />
              <stop offset="100%" stopColor="rgba(100, 200, 255, 0)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke="url(#lineGradient)"
            strokeWidth="2"
          />
        </svg>

        <div className="absolute top-30 left-300 w-24 h-24 border-2 border-cyan-500 opacity-20 animate-pulse"></div>
        <div className="absolute top-70 right-20 w-24 h-24 border-2 border-blue-400 opacity-20"></div>
        <div className="absolute top-80 left-350 w-40 h-40 border-2 border-cyan-600 opacity-10 animate-pulse"></div>
        <div className="absolute top-32 left-100 w-60 h-60 border-2 border-cyan-600 opacity-10 animate-pulse"></div>

        <div className="absolute inline-flex top-30 left-12 gap-2 px-4 py-2 rounded-full border border-cyan-400 border-opacity-10">
          <span className="text-cyan-300 font-light text-sm">
            Advanced Surveillance Tech
          </span>
        </div>

        <div className="relative z-10 max-w-full mx-auto px-4 sm:px-6 lg:px-8 ml-4 mt-0 h-[650px] items-end">
          <div className="grid md:grid-cols-[40%_60%] gap-12 items-center mt-60">
            {/* LEFT — 30% */}
            <div className="space-y-10">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Welcome to Our
                <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                  {" "}
                  CCTV Store
                </span>
              </h1>

              <p className="text-sm text-cyan-100 leading-relaxed font-medium">
                Professional CCTV installation and sales services. Protect what
                matters most with cutting-edge surveillance technology and
                expert installation.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/cctv-packages"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-4xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 duration-1000 font-semibold shadow-2xl"
                >
                  Schedule Installation
                </a>
                <a
                  href="/products"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-4xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 duration-1000 font-semibold shadow-2xl"
                >
                  View Products
                </a>
              </div>
            </div>

            {/* RIGHT — 70% */}
            <div className="relative flex justify-end items-end px-6 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-transparent opacity-20 blur-3xl rounded-full"></div>

              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500 bg-opacity-20 p-3 rounded-full border border-cyan-400 border-opacity-50">
                    <Phone className="text-cyan-300" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-cyan-200">Call Us</p>
                    <p className="text-white font-semibold">+94 75 244 6520</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full border border-blue-400 border-opacity-50">
                    <Mail className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Email Us</p>
                    <p className="text-white font-semibold">
                      info@skelectrical.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 px-6 md:px-16 items-center justify-center">
          {/* Brand 1 */}
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex justify-center items-center">
            <img
              src="/Hikvision.png"
              alt="Hikvision"
              className="h-12 object-contain grayscale hover:grayscale-0 transition"
            />
          </div>

          {/* Brand 2 */}
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex justify-center items-center">
            <img
              src="/dahua-seeklogo.png"
              alt="Dahua"
              className="h-12 object-contain grayscale hover:grayscale-0 transition"
            />
          </div>

          {/* Brand 3 */}
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex justify-center items-center">
            <img
              src="/uniview-seeklogo.png"
              alt="Uniview"
              className="h-12 object-contain grayscale hover:grayscale-0 transition"
            />
          </div>

          {/* Brand 4 */}
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex justify-center items-center">
            <img
              src="/axis-communications-seeklogo.png"
              alt="Axis"
              className="h-12 object-contain grayscale hover:grayscale-0 transition"
            />
          </div>

          {/* Brand 5 */}
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex justify-center items-center">
            <img
              src="/idIWq5UP2d_logos.png"
              alt="CP Plus"
              className="h-12 object-contain grayscale hover:grayscale-0 transition"
            />
          </div>

          {/* Brand 6 */}
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex justify-center items-center">
            <img
              src="/ezviz-logo_brandlogos.net_z9wlt.png"
              alt="Ezviz"
              className="h-12 object-contain grayscale hover:grayscale-0 transition"
            />
          </div>
        </div>
      </section>

      <div className="text-center text-4xl font-bold my-8">
        Popular Packages
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-16">
        {Packages.map((pkg) => (
          <div
            key={pkg._id.toString()}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Package Image */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              <img
                src={pkg.image}
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
                  <span className="text-sm">{pkg.cameras} Cameras</span>
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

      <section className="py-12 bg-gray-50">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            Popular Categories
          </h2>
          <p className="text-gray-500 mt-2">
            Explore the best CCTV and security product categories
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-16">
         
          {/* CCTV Systems */}
          <Link
            href="/products?query=camera"
            className="relative rounded-2xl overflow-hidden md:row-span-2 group cursor-pointer block"
          >
            <img
              src="WhatsApp Image 2026-01-04 at 6.31.13 PM.jpeg"
              alt="CCTV Systems"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center transition duration-300 group-hover:bg-black/60">
              <h3 className="text-3xl font-bold mb-2">CCTV Systems</h3>
              <p className="text-sm uppercase tracking-wide flex items-center gap-1">
                Explore <span>›</span>
              </p>
            </div>
          </Link>
          {/* Wireless Cameras */}
          <Link
            href="/products?query=camera"
            className="relative rounded-2xl overflow-hidden group cursor-pointer block"
          >
            <img
              src="WhatsApp Image 2026-01-04 at 6.30.03 PM.jpeg"
              alt="Wireless Cameras"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white transition duration-300 group-hover:bg-black/60">
              <h3 className="text-2xl font-bold mb-2">Wireless Cameras</h3>
              <p className="text-sm uppercase tracking-wide flex items-center gap-1">
                Explore <span>›</span>
              </p>
            </div>
          </Link>
          {/* Smart Doorbells */}
          <Link
            href="/products?query=doorbell"
            className="relative rounded-2xl overflow-hidden group cursor-pointer block"
          >
            <img
              src="WhatsApp Image 2026-01-04 at 6.31.36 PM.jpeg"
              alt="Smart Doorbells"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white transition duration-300 group-hover:bg-black/60">
              <h3 className="text-2xl font-bold mb-2">Smart Doorbells</h3>
              <p className="text-sm uppercase tracking-wide flex items-center gap-1">
                Explore <span>›</span>
              </p>
            </div>
          </Link>
          {/* Access Control Systems */}
          <Link
            href="/products?query=access-control"
            className="relative rounded-2xl overflow-hidden group cursor-pointer md:col-span-2 block"
          >
            <img
              src="2101.i211.016_door knobs handles realistic composition 2.jpg"
              alt="Access Control Systems"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white transition duration-300 group-hover:bg-black/60">
              <h3 className="text-2xl font-bold mb-2">
                Access Control Systems
              </h3>
              <p className="text-sm uppercase tracking-wide flex items-center gap-1">
                Explore <span>›</span>
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Best Sellers</h2>
          <p className="text-gray-500 mt-2">
            Our most trusted and popular security products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 md:px-16">
          {/* <ProductCard /> */}
          {posts?.length > 0 ? (
            posts.map((post: any, index: number) => (
              <ProductCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="text-center text-2xl">No Products</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Our Gallery</h2>
          <p className="text-gray-500 mt-2">
            Explore our recent CCTV installations and setups
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 md:px-16">
          {/* Image 1 */}
          <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <img
              src="/person-showcasing-their-home-through-smartphone.jpg"
              alt="Installation 1"
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Office Setup
              </span>
            </div>
          </div>

          {/* Image 2 */}
          <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <img
              src="/person-showcasing-their-home-using-their-smartphone.jpg"
              alt="Installation 2"
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Warehouse
              </span>
            </div>
          </div>

          {/* Image 3 */}
          <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <img
              src="/security-camera-urban-video (1).jpg"
              alt="Installation 3"
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Home Security
              </span>
            </div>
          </div>

          {/* Image 4 */}
          <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <img
              src="/security-camera-urban-video.jpg"
              alt="Installation 4"
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Outdoor Setup
              </span>
            </div>
          </div>

          {/* Image 5 */}
          <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <img
              src="/surveillance-camera-built-into-stone-wall-building.jpg"
              alt="Installation 5"
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Retail Store
              </span>
            </div>
          </div>

          {/* Image 6 */}
          <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <img
              src="/view-robot-tending-maintaining-gardens.jpg"
              alt="Installation 6"
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Hotel Lobby
              </span>
            </div>
          </div>

          {/* Image 7 */}
          <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <img
              src="/home-security-camera.jpg"
              alt="Installation 7"
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Parking Area
              </span>
            </div>
          </div>

          {/* Image 8 */}
          <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <img
              src="/modern-technology-controls-secure-domestic-room-indoors-generated-by-ai.jpg"
              alt="Installation 8"
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Factory Zone
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 mt-2">
            Real experiences from our happy clients
          </p>
        </div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-16">
          {/* Card 1 */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <img
                src="/customers/user1.jpg"
                alt="Customer 1"
                className="w-14 h-14 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Ruwan Perera
                </h3>
                <p className="text-sm text-gray-500">Home CCTV Setup</p>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              “Excellent service! The team installed cameras quickly and
              explained everything clearly. The video quality is superb and app
              monitoring works perfectly.”
            </p>

            <div className="flex text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.785 1.401 8.17L12 18.896l-7.335 3.87 1.401-8.17L.132 9.211l8.2-1.193L12 .587z" />
                  </svg>
                ))}
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <img
                src="/customers/user2.jpg"
                alt="Customer 2"
                className="w-14 h-14 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Nadeesha Silva
                </h3>
                <p className="text-sm text-gray-500">Office Security System</p>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              “Professional team with great after-sales support. The remote
              access feature is really helpful for our office monitoring. Highly
              recommended!”
            </p>

            <div className="flex text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.785 1.401 8.17L12 18.896l-7.335 3.87 1.401-8.17L.132 9.211l8.2-1.193L12 .587z" />
                  </svg>
                ))}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <img
                src="/customers/user3.jpg"
                alt="Customer 3"
                className="w-14 h-14 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Chamika Fernando
                </h3>
                <p className="text-sm text-gray-500">Retail Store</p>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              “Great pricing and reliable equipment. The DVR interface is easy
              to use and the camera clarity is amazing even at night.”
            </p>

            <div className="flex text-yellow-400">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.785 1.401 8.17L12 18.896l-7.335 3.87 1.401-8.17L.132 9.211l8.2-1.193L12 .587z" />
                  </svg>
                ))}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 text-yellow-400"
              >
                <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.785 1.401 8.17L12 18.896l-7.335 3.87 1.401-8.17L.132 9.211l8.2-1.193L12 .587z" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
