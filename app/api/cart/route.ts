import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CartRepository } from "@/lib/typeorm/repositories/cartRepository";

// GET user's cart
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await CartRepository.getOrCreateCart(session.user.email);

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST add item to cart
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, productname, title, price, image, quantity, inStock } =
      body;

    // Validate required fields
    if (
      !productId ||
      !productname ||
      !title ||
      !price ||
      !image ||
      !quantity
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cart = await CartRepository.addItem(session.user.email, {
      productId,
      productname,
      title,
      price,
      image,
      quantity: Number(quantity),
      inStock: inStock !== false,
    });

    return NextResponse.json({ cart, message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// DELETE clear cart
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await CartRepository.clearCart(session.user.email);

    return NextResponse.json({ cart, message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}