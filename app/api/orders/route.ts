// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // For guest orders
    const userId = searchParams.get("userId"); // For authenticated users
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build query - require either email or userId for security
    const query: any = {};
    if (email) {
      query.customerEmail = email;
    } else if (userId) {
      query.user = userId;
    } else {
      return NextResponse.json(
        { error: "Email or userId required" },
        { status: 400 }
      );
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name slug images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/orders]", err);
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
    const {
      customer,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod = "COD",
      userId // optional for authenticated users
    } = body;

    // Validate required fields
    if (!customer?.email || !shippingAddress || !items?.length) {
      return NextResponse.json(
        { error: "Missing required order information" },
        { status: 400 }
      );
    }

    // Format items to exactly match OrderItemSchema
    const formattedItems = items.map((item: any) => ({
      product: item.id, // MongoDB ObjectId
      variant: item.variantId || undefined,
      name: item.name,
      sku: item.sku || item.slug || "SKU-UNKNOWN",
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity, 
      image: item.image || "",
    }));

    // Generate order number manually BEFORE creating the document
    // This bypasses the strict Mongoose validation error
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
    const orderNumber = `ADR-${date}-${random}`;

    // Create the order
    const order = await Order.create({
      orderNumber, // Passed explicitly here
      user: userId || null, 
      guestEmail: customer.email, 
      shippingAddress: {
        fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        line1: shippingAddress.address,
        line2: shippingAddress.apartment || "",
        city: shippingAddress.city,
        state: shippingAddress.state || "N/A", // Safely mapped to your new form field
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || "US",
        phone: customer.phone,
      },
      items: formattedItems,
      subtotal,
      shippingCost: shipping, 
      total,
      paymentMethod,
      paymentStatus: "pending",
      status: "processing", 
    });

    return NextResponse.json(
      {
        success: true,
        orderNumber: order.orderNumber, 
        orderId: order._id
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[POST /api/orders] Error:", err);

    // Better error logging so we know exactly what failed
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}