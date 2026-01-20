// File: src/app/admin/components/BookingsTab.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Edit2,
  X,
  AlertCircle,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Trash2,
} from "lucide-react";

interface CCTVBooking {
  _id: string;
  packagename: string;
  userId: string;
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
  estimatedCompletionDate?: string;
  technician?: string;
  technicianPhone?: string;
}

interface BookingsTabProps {
  onUpdate?: () => void;
}

interface BookingStats {
  totalBookings: number;
  totalRevenue: string;
  pendingBookings: number;
  completedBookings: number;
}

export default function BookingsTab({ onUpdate }: BookingsTabProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookings, setBookings] = useState<CCTVBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<CCTVBooking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    bookingStatus: "",
    technician: "",
    technicianPhone: "",
    estimatedCompletionDate: "",
    notes: "",
  });

  const [stats, setStats] = useState<BookingStats>({
    totalBookings: 0,
    totalRevenue: "0",
    pendingBookings: 0,
    completedBookings: 0,
  });

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/cctv-bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/cctv-bookings/stats");
      const data = await res.json();
      setStats(data.stats || stats);
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  const handleEditBooking = (booking: CCTVBooking) => {
    setSelectedBooking(booking);
    setBookingFormData({
      bookingStatus: booking.bookingStatus,
      technician: booking.technician || "",
      technicianPhone: booking.technicianPhone || "",
      estimatedCompletionDate: booking.estimatedCompletionDate || "",
      notes: "",
    });
    setShowBookingModal(true);
  };

  const handleBookingInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setBookingFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    setUpdatingBookingId(selectedBooking._id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/cctv-bookings/${selectedBooking._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingFormData),
      });

      if (!res.ok) throw new Error("Failed to update booking");

      setSuccess("Booking updated successfully!");
      setShowBookingModal(false);
      fetchBookings();
      fetchStats();
      onUpdate?.();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/api/admin/cctv-bookings/${bookingId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to cancel booking");

      setSuccess("Booking cancelled successfully!");
      fetchBookings();
      fetchStats();
      onUpdate?.();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getBookingStatusColor = (status: string) => {
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

  const filteredBookings = bookings.filter((booking) => {
    if (bookingStatusFilter === "all") return true;
    return booking.bookingStatus === bookingStatusFilter;
  });

  return (
    <div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalBookings}
              </p>
            </div>
            <Calendar size={32} className="text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                Rs {parseFloat(stats.totalRevenue)}
              </p>
            </div>
            <DollarSign size={32} className="text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Bookings</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pendingBookings}
              </p>
            </div>
            <Clock size={32} className="text-yellow-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed Bookings</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.completedBookings}
              </p>
            </div>
            <CheckCircle size={32} className="text-green-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Header with Filters */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          CCTV Installation Bookings
        </h2>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "scheduled", "in_progress", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setBookingStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  bookingStatusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {status === "in_progress"
                  ? "In Progress"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No bookings found</p>
            <p className="text-sm">
              {bookingStatusFilter === "all"
                ? "Bookings will appear here once customers book installations."
                : `No ${bookingStatusFilter} bookings at the moment.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{booking._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 font-medium">
                          {booking.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {booking.packagename}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 text-sm">
                        {booking.city}, {booking.state}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <p>
                        {new Date(booking.preferredDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.preferredTime}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getBookingStatusColor(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus === "in_progress"
                          ? "In Progress"
                          : booking.bookingStatus.charAt(0).toUpperCase() +
                            booking.bookingStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Rs {parseFloat(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Booking"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Cancel Booking"
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

      {/* Booking Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold">
                Update Booking #{selectedBooking._id.slice(-8).toUpperCase()}
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking Details Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Booking Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Package</p>
                    <p className="font-medium text-gray-900">
                      {selectedBooking.packagename}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer Email</p>
                    <p className="font-medium text-gray-900">
                      {selectedBooking.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {selectedBooking.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">
                      {selectedBooking.city}, {selectedBooking.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Installation Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(
                        selectedBooking.preferredDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time Slot</p>
                    <p className="font-medium text-gray-900">
                      {selectedBooking.preferredTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status *
                </label>
                <select
                  name="bookingStatus"
                  value={bookingFormData.bookingStatus}
                  onChange={handleBookingInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Technician Assignment */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Technician Assignment
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technician Name
                    </label>
                    <input
                      type="text"
                      name="technician"
                      placeholder="e.g., John Smith"
                      value={bookingFormData.technician}
                      onChange={handleBookingInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technician Phone
                    </label>
                    <input
                      type="tel"
                      name="technicianPhone"
                      placeholder="+1 (555) 123-4567"
                      value={bookingFormData.technicianPhone}
                      onChange={handleBookingInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Estimated Completion */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Completion Date
                </label>
                <input
                  type="date"
                  name="estimatedCompletionDate"
                  value={bookingFormData.estimatedCompletionDate}
                  onChange={handleBookingInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Installation Details */}
              <div className="border-t border-gray-200 pt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Installation Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="text-gray-900">{selectedBooking.streetAddress}</p>
                    {selectedBooking.landmark && (
                      <p className="text-gray-700">
                        Landmark: {selectedBooking.landmark}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600">Vehicle Access</p>
                    <p className="text-gray-900">
                      {selectedBooking.vehicleAccess
                        ? "✓ Easy Access"
                        : "⚠ Restricted"}
                    </p>
                    {selectedBooking.vehicleAccessDetails && (
                      <p className="text-gray-700">
                        {selectedBooking.vehicleAccessDetails}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600">Cable Management</p>
                    <p className="text-gray-900">
                      {selectedBooking.cableManagement
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Power Availability</p>
                    <p className="text-gray-900">
                      {selectedBooking.powerAvailability}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Internet</p>
                    <p className="text-gray-900">
                      {selectedBooking.internetConnection ? "✓ Yes" : "✗ No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {selectedBooking.specialRequirements && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Special Requirements
                  </h3>
                  <p className="text-gray-700">
                    {selectedBooking.specialRequirements}
                  </p>
                </div>
              )}

              {/* Notes */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Notes
                </label>
                <textarea
                  name="notes"
                  placeholder="Add any internal notes for the team..."
                  value={bookingFormData.notes}
                  onChange={handleBookingInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleUpdateBooking}
                  disabled={updatingBookingId === selectedBooking._id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
                >
                  {updatingBookingId === selectedBooking._id
                    ? "Updating..."
                    : "Update Booking"}
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}