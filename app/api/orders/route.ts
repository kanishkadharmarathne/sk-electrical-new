import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { OrderRepository } from "@/lib/typeorm/repositories/orderRepository";
import { CartRepository } from "@/lib/typeorm/repositories/cartRepository";

// GET all orders for authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await OrderRepository.getOrdersByUserId(session.user.email);
    const stats = await OrderRepository.getOrderStats(session.user.email);

    return NextResponse.json({ orders, stats });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST create new order (from cart)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      shippingCountry,
      phoneNumber,
      paymentMethod,
      notes,
    } = body;

    // Validate required fields
    // if (
    //   !shippingAddress ||
    //   !shippingCity ||
    //   !shippingState ||
    //   !shippingZipCode ||
    //   !shippingCountry ||
    //   !phoneNumber ||
    //   !paymentMethod
    // ) {
    //   return NextResponse.json(
    //     { error: "Missing required shipping information" },
    //     { status: 400 }
    //   );
    // }

    // Get user's cart
    const cart = await CartRepository.getCartByUserId(session.user.email);

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate tax (10% for example)
    const tax = (parseFloat(cart.totalPrice) * 0.1).toFixed(2);
    const shippingCost = "0"; // Free shipping

    // Create order
    const order = await OrderRepository.createOrder({
      userId: session.user.email,
      items: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      tax,
      shippingCost,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      shippingCountry,
      phoneNumber,
      paymentMethod,
      notes,
    });

    // Clear cart after order creation
    await CartRepository.clearCart(session.user.email);

    return NextResponse.json({
      order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}