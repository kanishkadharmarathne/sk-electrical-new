import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { OrderRepository } from "@/lib/typeorm/repositories/orderRepository";

// Middleware to check if user is admin
// You can add role check here
async function isAdmin() {
  const session = await auth();
  // Add your admin check logic here
  // For now, we'll assume any authenticated user with admin access can view
  return !!session?.user?.email;
}

// GET all orders (admin only)
export async function GET() {
  try {
    // Check if user is admin
    const adminAccess = await isAdmin();
    if (!adminAccess) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    // Fetch all orders from database
    const orders = await OrderRepository.getAllOrders();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}