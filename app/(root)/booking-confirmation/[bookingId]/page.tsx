"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  MapPin,
  Clock,
  Truck,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface CCTVBooking {
  _id: string;
  packagename: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
  preferredDate: string;
  preferredTime: string;
  vehicleAccess: boolean;
  vehicleAccessDetails?: string;
  accessInstructions?: string;
  cableManagement: string;
  internetConnection: boolean;
  powerAvailability: string;
  specialRequirements?: string;
  alternatePhone?: string;
  bookingStatus: string;
  totalPrice: string;
  createdAt: string;
}

export default function BookingConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<CCTVBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cctv-bookings/${bookingId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch booking");
      }

      setBooking(data.booking);
    } catch (error: any) {
      setError(error.message || "Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <p className="text-red-600 text-lg font-semibold">
            {error || "Booking not found"}
          </p>
          <Link
            href="/cctv-packages"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  const installationDate = new Date(booking.preferredDate);
  const bookingDate = new Date(booking.createdAt);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Your CCTV installation has been successfully scheduled
          </p>
        </div>

        {/* Booking Reference */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-8">
          <p className="text-sm font-medium mb-1">Booking Reference Number</p>
          <p className="text-3xl font-bold font-mono">{bookingId.slice(-12)}</p>
          <p className="text-sm text-blue-100 mt-2">
            Please save this number for your records
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Package Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Package</span>
                  <span className="font-semibold text-gray-900">
                    {booking.packagename}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Booking Status</span>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Pending Confirmation
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Price</span>
                  <span className="text-2xl font-bold text-blue-600">
                    Rs {booking.totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Installation Schedule */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="text-blue-600" size={24} />
                Installation Schedule
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Preferred Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {installationDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Preferred Time Slot</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.preferredTime}
                  </p>
                </div>
                {booking.accessInstructions && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Access Instructions
                    </p>
                    <p className="text-gray-900">{booking.accessInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="text-blue-600" size={24} />
                Installation Address
              </h2>
              <div className="space-y-2 text-gray-900">
                <p className="font-medium">{booking.streetAddress}</p>
                {booking.landmark && (
                  <p className="text-sm text-gray-600">
                    Landmark: {booking.landmark}
                  </p>
                )}
                <p>
                  {booking.city}, {booking.state} {booking.zipCode}
                </p>
                <p>{booking.country}</p>
              </div>
            </div>

            {/* Installation Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="text-blue-600" size={24} />
                Installation Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vehicle Access</p>
                  <p className="font-medium text-gray-900">
                    {booking.vehicleAccess ? "✓ Easily Accessible" : "⚠ Restricted"}
                  </p>
                  {booking.vehicleAccessDetails && (
                    <p className="text-sm text-gray-700 mt-1">
                      {booking.vehicleAccessDetails}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Cable Management
                  </p>
                  <p className="font-medium text-gray-900">
                    {booking.cableManagement
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Power Availability</p>
                  <p className="font-medium text-gray-900">
                    {booking.powerAvailability}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Internet Connection
                  </p>
                  <p className="font-medium text-gray-900">
                    {booking.internetConnection ? "✓ Available" : "✗ Not Available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequirements && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Special Requests
                </h2>
                <p className="text-gray-900">{booking.specialRequirements}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{booking.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Primary Phone</p>
                    <p className="font-medium text-gray-900">{booking.phone}</p>
                  </div>
                </div>
                {booking.alternatePhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Alternate Phone</p>
                      <p className="font-medium text-gray-900">
                        {booking.alternatePhone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* What Happens Next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                What Happens Next?
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Confirmation Call
                    </p>
                    <p className="text-sm text-gray-600">
                      We'll call to confirm the schedule
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Pre-Installation
                    </p>
                    <p className="text-sm text-gray-600">
                      Technician will prepare materials
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Installation Day</p>
                    <p className="text-sm text-gray-600">
                      Professional installation at your location
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Training & Support</p>
                    <p className="text-sm text-gray-600">
                      Get trained and ongoing support
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
              <h3 className="text-sm font-bold text-yellow-900 mb-2">
                Important Notes
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Please keep your phone available on the booking date</li>
                <li>• Ensure someone is home during installation</li>
                <li>• Clear the installation area beforehand</li>
                <li>• Provide technician easy access</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <Link
                href="/bookings"
                className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition"
              >
                View All Bookings
              </Link>
              <Link
                href="/cctv-packages"
                className="block w-full px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg text-center transition"
              >
                Browse More Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}