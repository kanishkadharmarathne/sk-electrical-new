import Link from "next/link";
import React from "react";

const ProductCard = ({ post }: { post: any }) => {
  return (
    <div className="w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <Link href={`/products/${post._id}`}>
        <div className="bg-gray-50 p-1 flex items-center justify-center h-56">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* Price */}
        <div className="mb-2">
          <span className="text-lg font-bold text-gray-900">
            Rs {post.price}
          </span>
        </div>

        {/* Colors Available */}
        <p className="text-xs text-gray-600 mb-2">
          Available in {post.colors} colors
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(post.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {post.rating}
          </span>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              post.inStock ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span
            className={`text-xs font-medium ${
              post.inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            {post.inStock ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
