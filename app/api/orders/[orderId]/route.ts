import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { OrderRepository } from "@/lib/typeorm/repositories/orderRepository";
import { OrderStatus, PaymentStatus } from "@/lib/typeorm/entities/Order";

// GET specific order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;

    const order = await OrderRepository.getOrderByIdAndUserId(
      orderId,
      session.user.email
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT update order (admin only - in production add role check)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const body = await request.json();
    const {
      orderStatus,
      paymentStatus,
      trackingNumber,
      notes,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      shippingCountry,
      phoneNumber,
      paymentMethod,
    } = body;

    // Verify user owns this order
    const order = await OrderRepository.getOrderByIdAndUserId(
      orderId,
      session.user.email
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await OrderRepository.updateOrder(orderId, {
      orderStatus: orderStatus as OrderStatus,
      paymentStatus: paymentStatus as PaymentStatus,
      trackingNumber,
      notes,
      shippingAddress,
      shippingState,
      shippingCity,
      shippingZipCode,
      shippingCountry,
      phoneNumber,
      paymentMethod,
    });

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

// DELETE cancel order
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;

    // Verify user owns this order
    const order = await OrderRepository.getOrderByIdAndUserId(
      orderId,
      session.user.email
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow cancellation of pending orders
    if (order.orderStatus !== OrderStatus.PENDING) {
      return NextResponse.json(
        { error: "Only pending orders can be cancelled" },
        { status: 400 }
      );
    }

    const cancelledOrder = await OrderRepository.cancelOrder(orderId);

    return NextResponse.json({
      order: cancelledOrder,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
