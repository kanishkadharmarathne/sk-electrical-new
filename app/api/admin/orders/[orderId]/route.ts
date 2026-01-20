import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { OrderRepository } from "@/lib/typeorm/repositories/orderRepository";
import { OrderStatus, PaymentStatus } from "@/lib/typeorm/entities/Order";

async function isAdmin() {
  const session = await auth();
  return !!session?.user?.email;
}

// PUT update order (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const adminAccess = await isAdmin();
    if (!adminAccess) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { orderId } = await params;
    const body = await request.json();
    const { orderStatus, paymentStatus, trackingNumber, notes } = body;

    // Update order
    const updatedOrder = await OrderRepository.updateOrder(orderId, {
      orderStatus: orderStatus as OrderStatus,
      paymentStatus: paymentStatus as PaymentStatus,
      trackingNumber,
      notes,
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order: updatedOrder,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}