import ProductCard from "@/components/ProductCard";
import SearchForm from "@/components/SearchForm";
import { ProductRepository } from "@/lib/typeorm/repositories/productRepository";
import Link from "next/link";
import React from "react";

const product = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;

  // Fetch products from database
  const posts = query
    ? await ProductRepository.searchProducts(query)
    : await ProductRepository.findAll();
    

  return (
    <>
      
      <section>
        <div className="flex items-center gap-8 justify-center mt-4">
          {/* Image-like button */}
          <Link 
            href="?query=camera"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:scale-105 transition-transform">
            <img
              src="/cctvcam.png"
              alt="Camera"
              className="w-6 h-6 object-cover rounded"
            />
            <span className="text-sm font-medium text-gray-800">Camera</span>
          </Link>

          <Link 
            href="?query=Cable"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:scale-105 transition-transform">
            <img
              src="/cabel.png"
              alt="Cable"
              className="w-6 h-6 object-cover rounded"
            />
            <span className="text-sm font-medium text-gray-800">Cable</span>
          </Link>

          <Link 
            href="?query=DVR"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:scale-105 transition-transform">
            <img
              src="/dvrr.png"
              alt="DVR"
              className="w-6 h-6 object-cover rounded"
            />
            <span className="text-sm font-medium text-gray-800">DVR</span>
          </Link>

          <Link 
            href="?query=Storage"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:scale-105 transition-transform">
            <img
              src="/harddsk.png"
              alt="Camera"
              className="w-6 h-6 object-cover rounded"
            />
            <span className="text-sm font-medium text-gray-800">Storage</span>
          </Link>

          <Link 
            href="?query=Monitor"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:scale-105 transition-transform">
            <img
              src="/monitor.png"
              alt="Camera"
              className="w-6 h-6 object-cover rounded"
            />
            <span className="text-sm font-medium text-gray-800">Monitor</span>
          </Link>

          <Link 
            href="?query=Ups"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:scale-105 transition-transform">
            <img
              src="/ups.png"
              alt="Camera"
              className="w-6 h-6 object-cover rounded"
            />
            <span className="text-sm font-medium text-gray-800">Ups</span>
          </Link>

          {/* Search form */}
          <SearchForm query={query} />
        </div>
      </section>
      <div className="flex items-center justify-center mx-2">
      <section className="justify-items-center mt-8">
        <p className="text-4xl my-4 text-center">{query ? `Search result for "${query}"` : "All Products"}</p>
        <ul className="mt-7 card-grid mb-7 ">
          {posts?.length > 0 ? (
            posts.map((post: any, index: number) => (
              <ProductCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="text-center text-2xl">No Products</p>
          )}
        </ul>
      </section>
      </div>
    </>
  );
};

export default product;