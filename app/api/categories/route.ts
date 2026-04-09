// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const parent = searchParams.get("parent"); // null for top-level, or parent ID
    const activeOnly = searchParams.get("activeOnly") !== "false"; // default true

    // Build query
    const query: any = {};
    if (activeOnly) {
      query.isActive = true;
    }
    if (parent !== null) {
      query.parent = parent || null; // empty string becomes null
    }

    const categories = await Category.find(query)
      .sort({ name: 1 })
      .lean();

    // If no parent filter, organize into hierarchy
    if (parent === null) {
      const topLevel = categories.filter(cat => !cat.parent);
      const withChildren = topLevel.map(parentCat => ({
        ...parentCat,
        children: categories.filter(cat =>
          cat.parent && cat.parent.toString() === parentCat._id.toString()
        ),
      }));

      return NextResponse.json({ categories: withChildren });
    }

    return NextResponse.json({ categories });
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Create the category (slug will be auto-generated in pre-save hook)
    const category = await Category.create({
      name: body.name,
      description: body.description,
      image: body.image,
      parent: body.parent || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/categories]", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors (e.g., unique slug)
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Optional: You could also add logic here to prevent deleting a category 
    // if it still has products attached to it!
    await Category.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /api/categories]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}