import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CCTVBookingRepository } from "@/lib/typeorm/repositories/cctvBookingRepository";

// GET user's bookings
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await CCTVBookingRepository.getBookingsByUserId(
      session.user.email
    );

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST create booking
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (
      !body.packageId ||
      !body.packagename ||
      !body.streetAddress ||
      !body.city ||
      !body.state ||
      !body.zipCode ||
      !body.country ||
      !body.preferredDate ||
      !body.preferredTime
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = await CCTVBookingRepository.createBooking({
      userId: session.user.email,
      packageId: body.packageId,
      packagename: body.packagename,
      email: body.email || session.user.email,
      phone: body.phone,
      streetAddress: body.streetAddress,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      country: body.country,
      landmark: body.landmark,
      preferredDate: new Date(body.preferredDate),
      preferredTime: body.preferredTime,
      vehicleAccess: body.vehicleAccess,
      vehicleAccessDetails: body.vehicleAccessDetails,
      accessInstructions: body.accessInstructions,
      cableManagement: body.cableManagement,
      internetConnection: body.internetConnection,
      powerAvailability: body.powerAvailability,
      specialRequirements: body.specialRequirements,
      alternatePhone: body.alternatePhone,
      totalPrice: body.totalPrice || "0",
    });

    return NextResponse.json({
      booking,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
