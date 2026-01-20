// File: src/app/admin/packages/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  X,
  AlertCircle,
  Upload,
  Check,
  Loader,
} from "lucide-react";

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

interface AllProducts {
  _id: string;
  productname: string;
  title: string;
  price: string;
  image: string;
}

interface PackageTabProps {
  onUpdate?: () => void;
}

export default function AdminPackagesPage({ onUpdate }: PackageTabProps) {
  const [packages, setPackages] = useState<CCTVPackage[]>([]);
  const [allProducts, setAllProducts] = useState<AllProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState("");

  // Form Data
  const [formData, setFormData] = useState({
    packagename: "",
    description: "",
    shortDescription: "",
    image: "",
    coverImage: "",
    price: "",
    cameras: "4",
    installationDays: "1",
    warranty: "1 Year",
    coverage: "",
    products: [] as PackageProduct[],
    features: [] as string[],
    isAvailable: true,
  });

  const [newFeature, setNewFeature] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productQuantity, setProductQuantity] = useState("1");

  // Fetch packages and products
  useEffect(() => {
    fetchPackages();
    fetchProducts();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cctv-packages");
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      setError("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setAllProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  // Handle image upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "image" | "coverImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (imageType === "image") {
        setImagePreview(reader.result as string);
      } else {
        setCoverImagePreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setError("");

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        [imageType]: data.url,
      }));
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "cameras" || name === "installationDays"
          ? parseInt(value)
          : value,
    }));
  };

  // Add feature
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature],
      }));
      setNewFeature("");
    }
  };

  // Remove feature
  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Add product to package
  const handleAddProduct = () => {
    if (!selectedProductId || !productQuantity) {
      setError("Please select product and quantity");
      return;
    }

    const product = allProducts.find((p) => p._id === selectedProductId);
    if (!product) return;

    const existingProduct = formData.products.find(
      (p) => p.productId === selectedProductId
    );

    if (existingProduct) {
      setFormData((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.productId === selectedProductId
            ? { ...p, quantity: parseInt(productQuantity) }
            : p
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        products: [
          ...prev.products,
          {
            productId: product._id,
            productname: product.productname,
            title: product.title,
            price: product.price,
            quantity: parseInt(productQuantity),
          },
        ],
      }));
    }

    setSelectedProductId("");
    setProductQuantity("1");
  };

  // Remove product from package
  const handleRemoveProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.productId !== productId),
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      packagename: "",
      description: "",
      shortDescription: "",
      image: "",
      coverImage: "",
      price: "",
      cameras: "4",
      installationDays: "1",
      warranty: "1 Year",
      coverage: "",
      products: [],
      features: [],
      isAvailable: true,
    });
    setEditingId(null);
    setImagePreview("");
    setCoverImagePreview("");
    setNewFeature("");
  };

  // Handle edit package
  const handleEditPackage = (pkg: CCTVPackage) => {
    setFormData({
      packagename: pkg.packagename,
      description: pkg.description,
      shortDescription: pkg.shortDescription,
      image: pkg.image,
      coverImage: pkg.coverImage,
      price: pkg.price,
      cameras: pkg.cameras.toString(),
      installationDays: pkg.installationDays.toString(),
      warranty: pkg.warranty,
      coverage: pkg.coverage,
      products: pkg.products,
      features: pkg.features,
      isAvailable: pkg.isAvailable,
    });
    setImagePreview(pkg.image);
    setCoverImagePreview(pkg.coverImage);
    setEditingId(pkg._id);
    setShowModal(true);
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate required fields
    if (!formData.packagename || !formData.price || formData.products.length === 0) {
      setError("Please fill in all required fields and add at least one product");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/cctv-packages/${editingId}`
        : "/api/cctv-packages";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cameras: parseInt(formData.cameras),
          installationDays: parseInt(formData.installationDays),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save package");
      }

      onUpdate?.();
      setSuccess(
        editingId ? "Package updated successfully!" : "Package created successfully!"
      );
      setShowModal(false);
      resetForm();
      fetchPackages();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle delete package
  const handleDeletePackage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(`/api/cctv-packages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete package");

      setSuccess("Package deleted successfully!");
      fetchPackages();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CCTV Packages</h1>
            <p className="text-gray-600 mt-1">Manage CCTV installation packages</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Add Package
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Packages Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading packages...
            </div>
          ) : packages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No packages yet. Create your first package!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Package Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Cameras
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Installation
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Warranty
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr
                      key={pkg._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {pkg.packagename}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {pkg.shortDescription}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {pkg.cameras}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        Rs {pkg.price}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {pkg.products.length} items
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {pkg.installationDays} day{pkg.installationDays > 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {pkg.warranty}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            pkg.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {pkg.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPackage(pkg)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Package" : "Create New Package"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="packagename"
                    placeholder="Package Name (e.g., 4-Camera Professional)"
                    value={formData.packagename}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <textarea
                    name="shortDescription"
                    placeholder="Short Description (max 100 chars)"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    maxLength={100}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <textarea
                    name="description"
                    placeholder="Full Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <textarea
                    name="coverage"
                    placeholder="Coverage Area (e.g., Up to 2000 sq ft)"
                    value={formData.coverage}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Package Image */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Package Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "image")}
                        disabled={uploading}
                        className="w-full"
                      />
                      {uploading && (
                        <p className="text-sm text-blue-600 mt-2">
                          Uploading...
                        </p>
                      )}
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg mx-auto mt-2"
                        />
                      )}
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Cover Image (Hero)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "coverImage")}
                        disabled={uploading}
                        className="w-full"
                      />
                      {uploading && (
                        <p className="text-sm text-blue-600 mt-2">
                          Uploading...
                        </p>
                      )}
                      {coverImagePreview && (
                        <img
                          src={coverImagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg mx-auto mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Specs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price & Specifications
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Rs )
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Cameras
                    </label>
                    <input
                      type="number"
                      name="cameras"
                      value={formData.cameras}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Installation Days
                    </label>
                    <input
                      type="number"
                      name="installationDays"
                      value={formData.installationDays}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty
                    </label>
                    <input
                      type="text"
                      name="warranty"
                      placeholder="e.g., 1 Year"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Features
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature (e.g., Night Vision)"
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Included Products
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a product</option>
                      {allProducts.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.productname} - Rs {product.price}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      placeholder="Qty"
                      className="w-20 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                    >
                      Add
                    </button>
                  </div>

                  {formData.products.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No products added yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formData.products.map((product) => (
                        <div
                          key={product.productId}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {product.quantity} × Rs {product.price}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(product.productId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium text-gray-700">
                    Available for purchase
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  {editingId ? "Update Package" : "Create Package"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}