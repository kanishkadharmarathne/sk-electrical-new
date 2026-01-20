import { NextResponse } from "next/server";
import { CCTVPackageRepository } from "@/lib/typeorm/repositories/cctvPackageRepository";

// GET all CCTV packages
export async function GET() {
  try {
    const packages = await CCTVPackageRepository.getAllPackages();
    return NextResponse.json({ packages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// POST create new package (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.packagename ||
      !body.description ||
      !body.price ||
      !body.products
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPackage = await CCTVPackageRepository.createPackage(body);

    return NextResponse.json({
      package: newPackage,
      message: "Package created successfully",
    });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}
