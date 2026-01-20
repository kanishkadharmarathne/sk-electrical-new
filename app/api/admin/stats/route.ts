import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { OrderRepository } from "@/lib/typeorm/repositories/orderRepository";

async function isAdmin() {
  const session = await auth();
  return !!session?.user?.email;
}

// GET admin statistics
export async function GET() {
  try {
    const adminAccess = await isAdmin();
    if (!adminAccess) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const stats = await OrderRepository.getAdminStats();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}