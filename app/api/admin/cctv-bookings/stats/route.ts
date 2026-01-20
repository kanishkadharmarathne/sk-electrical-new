import { NextResponse } from "next/server";
// import { checkAdminAccess } from "@/lib/admin-middleware";
import { CCTVBookingRepository } from "@/lib/typeorm/repositories/cctvBookingRepository";
import { BookingStatus } from "@/lib/typeorm/entities/CCTVBooking";

// GET admin statistics for bookings
export async function GET() {
  try {
    // const isAdmin = await checkAdminAccess();
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: "Unauthorized: Admin access required" },
    //     { status: 403 }
    //   );
    // }

    const bookings = await CCTVBookingRepository.getAllBookings();

    // Calculate statistics
    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .reduce((sum, booking) => sum + parseFloat(booking.totalPrice), 0)
      .toFixed(2);

    const pendingBookings = bookings.filter(
      (b) => b.bookingStatus === BookingStatus.PENDING
    ).length;

    const confirmedBookings = bookings.filter(
      (b) => b.bookingStatus === BookingStatus.CONFIRMED
    ).length;

    const scheduledBookings = bookings.filter(
      (b) => b.bookingStatus === BookingStatus.SCHEDULED
    ).length;

    const inProgressBookings = bookings.filter(
      (b) => b.bookingStatus === BookingStatus.IN_PROGRESS
    ).length;

    const completedBookings = bookings.filter(
      (b) => b.bookingStatus === BookingStatus.COMPLETED
    ).length;

    const cancelledBookings = bookings.filter(
      (b) => b.bookingStatus === BookingStatus.CANCELLED
    ).length;

    const stats = {
      totalBookings,
      totalRevenue,
      pendingBookings,
      confirmedBookings,
      scheduledBookings,
      inProgressBookings,
      completedBookings,
      cancelledBookings,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}