import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); 
    const userId = searchParams.get("userId"); 
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

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
      userId 
    } = body;

    if (!customer?.email || !shippingAddress || !items?.length) {
      return NextResponse.json(
        { error: "Missing required order information" },
        { status: 400 }
      );
    }

    const formattedItems = items.map((item: any) => ({
      product: item.id, 
      variant: item.variantId || undefined,
      name: item.name,
      sku: item.sku || item.slug || "SKU-UNKNOWN",
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity, 
      image: item.image || "",
    }));

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
    const orderNumber = `ADR-${date}-${random}`;

    const order = await Order.create({
      orderNumber, 
      user: userId || null, 
      guestEmail: customer.email, 
      shippingAddress: {
        // ✅ Direct mapping from the new BD-friendly form
        fullName: shippingAddress.fullName,
        line1: shippingAddress.address, 
        line2: "", // We removed apartment, so this is empty
        city: shippingAddress.city,
        state: shippingAddress.state, 
        postalCode: "", // We removed postalCode, so this is empty
        country: "BD",
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