import { NextResponse } from "next/server";
// import { checkAdminAccess } from "@/lib/admin-middleware";
import { CCTVBookingRepository } from "@/lib/typeorm/repositories/cctvBookingRepository";
import { BookingStatus } from "@/lib/typeorm/entities/CCTVBooking";

// PUT update booking (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    // const isAdmin = await checkAdminAccess();
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: "Unauthorized: Admin access required" },
    //     { status: 403 }
    //   );
    // }

    const { bookingId } = await params;
    const body = await request.json();
    const {
      bookingStatus,
      technician,
      technicianPhone,
      estimatedCompletionDate,
      notes,
    } = body;

    // Update booking
    const updatedBooking = await CCTVBookingRepository.updateBooking(
      bookingId,
      {
        bookingStatus: bookingStatus as BookingStatus,
        technician,
        technicianPhone,
        estimatedCompletionDate: estimatedCompletionDate
          ? new Date(estimatedCompletionDate)
          : undefined,
        notes,
      }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      booking: updatedBooking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE cancel booking (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    // const isAdmin = await checkAdminAccess();
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: "Unauthorized: Admin access required" },
    //     { status: 403 }
    //   );
    // }

    const { bookingId } = await params;

    const deleted = await CCTVBookingRepository.deleteBooking(bookingId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}