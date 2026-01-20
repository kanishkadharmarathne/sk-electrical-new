import { NextResponse } from "next/server";
import { ProductRepository } from "@/lib/typeorm/repositories/productRepository";

// GET all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const category = searchParams.get("category");

    let products;

    if (query) {
      products = await ProductRepository.searchProducts(query);
    } else if (category) {
      products = await ProductRepository.findByCategory(category);
    } else {
      products = await ProductRepository.findAll();
    }

    return NextResponse.json({ products, count: products.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const product = await ProductRepository.createProduct(body);
    
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

