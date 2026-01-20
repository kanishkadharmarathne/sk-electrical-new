"use client";

import React from "react";
import { X } from "lucide-react";

interface ProductModalProps {
  showModal: boolean;
  editingId: string | null;
  formData: {
    productname: string;
    title: string;
    description: string;
    price: string;
    image: string;
    category: string;
    colors: string;
    rating: string;
    inStock: boolean;
  };
  uploading: boolean;
  imagePreview: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProductModal({
  showModal,
  editingId,
  formData,
  uploading,
  imagePreview,
  onClose,
  onSubmit,
  onInputChange,
  onImageUpload,
}: ProductModalProps) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">
            {editingId ? "Edit Product" : "Create New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="productname"
              placeholder="Product Name"
              value={formData.productname}
              onChange={onInputChange}
              required
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={onInputChange}
              required
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={onInputChange}
            required
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>

            {(imagePreview || formData.image) && (
              <div className="mb-2">
                <img
                  src={imagePreview || formData.image}
                  alt="Current product"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              disabled={uploading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {uploading && (
              <p className="text-sm text-blue-600">Uploading image...</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={onInputChange}
              required
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={onInputChange}
              required
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="colors"
              placeholder="Colors"
              value={formData.colors}
              onChange={onInputChange}
              min="1"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={onInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} ⭐
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={onInputChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  In Stock
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              {editingId ? "Update Product" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}