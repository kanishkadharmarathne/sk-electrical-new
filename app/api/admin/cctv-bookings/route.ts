import { NextResponse } from "next/server";
// import { checkAdminAccess } from "@/lib/admin-middleware";
import { CCTVBookingRepository } from "@/lib/typeorm/repositories/cctvBookingRepository";

// GET all bookings (admin only)
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

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}