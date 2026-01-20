"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Trash2, Calendar, MapPin, AlertCircle, CheckCircle } from "lucide-react";

interface CCTVBooking {
  _id: string;
  packagename: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  preferredDate: string;
  preferredTime: string;
  vehicleAccess: boolean;
  bookingStatus: string;
  totalPrice: string;
  createdAt: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<CCTVBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<CCTVBooking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cctv-bookings");
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/api/auth/signin");
          return;
        }
        throw new Error(data.error || "Failed to fetch bookings");
      }

      setBookings(data.bookings || []);
    } catch (error: any) {
      setError(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={18} />;
      case "cancelled":
        return <AlertCircle size={18} />;
      default:
        return <Calendar size={18} />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.bookingStatus === filter;
  });

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`/api/cctv-bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      setBookings(bookings.filter((b) => b._id !== bookingId));
      setShowModal(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">
              Manage your CCTV installation bookings
            </p>
          </div>
          <Link
            href="/cctv-packages"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Book New
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Bookings Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't booked any CCTV installation yet
            </p>
            <Link
              href="/cctv-packages"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Browse Packages
            </Link>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {["all", "pending", "confirmed", "scheduled", "completed"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filter === status
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Bookings Grid */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No bookings with this status</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.packagename}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Booking ID: {booking._id.slice(-8).toUpperCase()}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${getStatusColor(
                            booking.bookingStatus
                          )}`}
                        >
                          {getStatusIcon(booking.bookingStatus)}
                          {booking.bookingStatus
                            .charAt(0)
                            .toUpperCase() + booking.bookingStatus.slice(1)}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                        {/* Date */}
                        <div className="flex items-start gap-2">
                          <Calendar className="text-blue-600 mt-1" size={18} />
                          <div>
                            <p className="text-xs text-gray-600">Installation Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(booking.preferredDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-600">
                              {booking.preferredTime}
                            </p>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-2">
                          <MapPin className="text-blue-600 mt-1" size={18} />
                          <div>
                            <p className="text-xs text-gray-600">Location</p>
                            <p className="font-medium text-gray-900 line-clamp-2">
                              {booking.city}, {booking.state}
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <p className="text-xs text-gray-600">Contact</p>
                          <p className="font-medium text-gray-900">
                            {booking.phone}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Total Price</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${booking.totalPrice}
                          </p>
                        </div>
                      </div>

                      {/* Vehicle Access */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-600">Vehicle Access</p>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.vehicleAccess
                            ? "✓ Easy Access"
                            : "⚠ Restricted Access"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <Eye size={18} />
                          View Details
                        </button>

                        <Link
                          href={`/booking-confirmation/${booking._id}`}
                          className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg text-center transition"
                        >
                          Confirmation
                        </Link>

                        {booking.bookingStatus === "pending" && (
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Booking Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Package</p>
                  <p className="font-semibold text-gray-900">
                    {selectedBooking.packagename}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-semibold text-gray-900">
                    {selectedBooking._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Installation Address</p>
                <p className="text-gray-900">{selectedBooking.streetAddress}</p>
                <p className="text-gray-900">
                  {selectedBooking.city}, {selectedBooking.state}{" "}
                  {selectedBooking.zipCode}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Schedule</p>
                <p className="text-gray-900">
                  {new Date(selectedBooking.preferredDate).toLocaleDateString()}
                </p>
                <p className="text-gray-900">{selectedBooking.preferredTime}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Contact Information</p>
                <p className="text-gray-900">Email: {selectedBooking.email}</p>
                <p className="text-gray-900">Phone: {selectedBooking.phone}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Total Price</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${selectedBooking.totalPrice}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Link
                  href={`/booking-confirmation/${selectedBooking._id}`}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition"
                >
                  Full Details
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 font-semibold rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}