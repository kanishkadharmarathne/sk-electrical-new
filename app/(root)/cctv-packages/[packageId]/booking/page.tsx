"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { MapPin, Clock, Truck, AlertCircle, CheckCircle } from "lucide-react";

interface CCTVPackage {
  _id: string;
  packagename: string;
  price: string;
  cameras: number;
  installationDays: number;
  warranty: string;
}

export default function CCTVBookingPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session , status} = useSession();
  const packageId = params.packageId as string;

  const [packageData, setPackageData] = useState<CCTVPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    landmark: "",
    preferredDate: "",
    preferredTime: "",
    vehicleAccess: true,
    vehicleAccessDetails: "",
    accessInstructions: "",
    cableManagement: "wall-mounted",
    internetConnection: false,
    powerAvailability: "",
    specialRequirements: "",
    alternatePhone: "",
  });


  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.email) {
      signIn("google");
      return;
    }

    fetchPackage();
    setFormData((prev) => ({
      ...prev,
      email: session?.user?.email || "",
    }));
  }, [session, packageId, router]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cctv-packages/${packageId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch package");
      }

      setPackageData(data.package);
    } catch (error: any) {
      setError(error.message || "Failed to load package");
    } finally {
      setLoading(false);
    }
  };

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
          : value,
    }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return (
        formData.phone.trim() !== "" &&
        formData.streetAddress.trim() !== "" &&
        formData.city.trim() !== "" &&
        formData.state.trim() !== "" &&
        formData.zipCode.trim() !== "" &&
        formData.country.trim() !== ""
      );
    }
    if (step === 2) {
      return (
        formData.preferredDate !== "" &&
        formData.preferredTime !== ""
      );
    }
    if (step === 3) {
      return (
        formData.cableManagement !== "" &&
        formData.powerAvailability.trim() !== ""
      );
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError("");
    } else {
      setError("Please fill in all required fields");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitBooking = async () => {
    if (!validateStep(3)) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/cctv-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          packagename: packageData?.packagename,
          totalPrice: packageData?.price,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      setSuccess("Booking created successfully!");
      setTimeout(() => {
        router.push(`/booking-confirmation/${data.booking._id}`);
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking form...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Package not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Installation</h1>
          <p className="text-gray-600 mt-2">
            Schedule your {packageData.packagename} installation
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Step Indicator */}
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          currentStep >= step
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step}
                      </div>
                      <p className="text-xs mt-2 font-medium text-gray-600">
                        {step === 1 && "Address"}
                        {step === 2 && "Schedule"}
                        {step === 3 && "Details"}
                        {step === 4 && "Review"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Address */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Delivery Address
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="e.g., Near City Park"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="United States"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                    >
                      Continue to Schedule
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Schedule */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    <Clock className="inline mr-2" size={24} />
                    Schedule Installation
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Estimated installation: {packageData.installationDays} day(s)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time Slot *
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select a time slot</option>
                      <option value="09:00-12:00">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="12:00-15:00">Afternoon (12:00 PM - 3:00 PM)</option>
                      <option value="15:00-18:00">Late Afternoon (3:00 PM - 6:00 PM)</option>
                      <option value="flexible">Flexible (I'll be available all day)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Instructions (Optional)
                    </label>
                    <textarea
                      name="accessInstructions"
                      value={formData.accessInstructions}
                      onChange={handleInputChange}
                      placeholder="e.g., Ring doorbell twice, gate code is 1234"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                    >
                      Continue to Details
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Installation Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    <Truck className="inline mr-2" size={24} />
                    Installation Details
                  </h2>

                  {/* Vehicle Access */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Vehicle Access
                    </h3>
                    <label className="flex items-start gap-3 cursor-pointer mb-3">
                      <input
                        type="radio"
                        name="vehicleAccess"
                        checked={formData.vehicleAccess === true}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            vehicleAccess: true,
                          }))
                        }
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          Vehicle can easily reach my location
                        </p>
                        <p className="text-sm text-gray-600">
                          Wide roads, large driveway available
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="vehicleAccess"
                        checked={formData.vehicleAccess === false}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            vehicleAccess: false,
                          }))
                        }
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          Vehicle access is restricted
                        </p>
                        <p className="text-sm text-gray-600">
                          Narrow roads, small entrance, parking issues
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Vehicle Details */}
                  {!formData.vehicleAccess && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Please explain vehicle access restrictions *
                      </label>
                      <textarea
                        name="vehicleAccessDetails"
                        value={formData.vehicleAccessDetails}
                        onChange={handleInputChange}
                        placeholder="e.g., Narrow gate requires small vehicle, uphill slope, parking at street corner"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  )}

                  {/* Cable Management */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cable Management Preference *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="cableManagement"
                          value="wall-mounted"
                          checked={formData.cableManagement === "wall-mounted"}
                          onChange={handleInputChange}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            Wall-Mounted
                          </p>
                          <p className="text-sm text-gray-600">
                            Visible cables on walls
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="cableManagement"
                          value="hidden-walls"
                          checked={formData.cableManagement === "hidden-walls"}
                          onChange={handleInputChange}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            Hidden in Walls (Extra Cost)
                          </p>
                          <p className="text-sm text-gray-600">
                            Cables run inside walls
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="cableManagement"
                          value="concealed-ducts"
                          checked={formData.cableManagement === "concealed-ducts"}
                          onChange={handleInputChange}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            Concealed Ducts (Extra Cost)
                          </p>
                          <p className="text-sm text-gray-600">
                            Cables in conduits/ducts
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Internet & Power */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Power Availability *
                    </label>
                    <input
                      type="text"
                      name="powerAvailability"
                      value={formData.powerAvailability}
                      onChange={handleInputChange}
                      placeholder="e.g., Multiple outlets available, needs extension cord"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="internetConnection"
                      checked={formData.internetConnection}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      I have internet connection available for remote monitoring
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alternate Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 987-6543"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                    >
                      Review Booking
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Special Requests */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Review & Special Requests
                  </h2>

                  {/* Address Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Delivery Address
                    </h3>
                    <p className="text-gray-700">{formData.streetAddress}</p>
                    {formData.landmark && (
                      <p className="text-gray-700">
                        Landmark: {formData.landmark}
                      </p>
                    )}
                    <p className="text-gray-700">
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                    <p className="text-gray-700">{formData.country}</p>
                  </div>

                  {/* Schedule Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Installation Schedule
                    </h3>
                    <p className="text-gray-700">
                      Date: {new Date(formData.preferredDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      Time: {formData.preferredTime}
                    </p>
                  </div>

                  {/* Installation Details Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Installation Details
                    </h3>
                    <p className="text-gray-700">
                      Vehicle Access:{" "}
                      {formData.vehicleAccess
                        ? "Accessible"
                        : "Restricted"}
                    </p>
                    <p className="text-gray-700">
                      Cable Management:{" "}
                      {formData.cableManagement
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </p>
                    <p className="text-gray-700">
                      Internet: {formData.internetConnection ? "Yes" : "No"}
                    </p>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests / Additional Information (Optional)
                    </label>
                    <textarea
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or additional information for the technician?"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the installation terms and conditions. I understand
                      the technician may contact me at the provided number to confirm
                      the schedule.
                    </span>
                  </label>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitBooking}
                      disabled={submitting}
                      className="px-8 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg transition flex items-center gap-2"
                    >
                      {submitting ? "Booking..." : "Confirm Booking"}
                      <CheckCircle size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Booking Summary
              </h2>

              {/* Package Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Package Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Package</p>
                    <p className="font-medium text-gray-900">
                      {packageData.packagename}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cameras</p>
                    <p className="font-medium text-gray-900">
                      {packageData.cameras}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Installation Time</p>
                    <p className="font-medium text-gray-900">
                      {packageData.installationDays} day(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Warranty</p>
                    <p className="font-medium text-gray-900">
                      {packageData.warranty}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package Price</span>
                    <span className="font-medium text-gray-900">
                      ${packageData.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cable Management</span>
                    <span className="font-medium text-gray-900">
                      {formData.cableManagement === "wall-mounted"
                        ? "Free"
                        : "+$200"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      $
                      {parseInt(packageData.price) +
                        (formData.cableManagement === "wall-mounted"
                          ? 0
                          : 200)}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Installation Includes
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Professional installation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">System testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">User training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Full warranty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">24/7 support</span>
                  </li>
                </ul>
              </div>

              {/* Step Info */}
              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-900 font-medium">
                  Step {currentStep} of 4
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}