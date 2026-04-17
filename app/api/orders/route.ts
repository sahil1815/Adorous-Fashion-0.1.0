import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; // ✅ IMPORTED the Product model so we can edit stock!

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
      query.guestEmail = email; 
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

    // 1. Create the official order receipt in the database
    const order = await Order.create({
      orderNumber, 
      user: userId || null, 
      guestEmail: customer.email, 
      shippingAddress: {
        fullName: shippingAddress.fullName,
        line1: shippingAddress.address, 
        line2: "", 
        city: shippingAddress.city,
        state: shippingAddress.state, 
        postalCode: "", 
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

    // ✅ 2. THE MAGIC: AUTOMATICALLY DEDUCT STOCK
    for (const item of formattedItems) {
      // Find the specific product in the database
      const product = await Product.findById(item.product);
      
      if (product) {
        // Deduct from the total overall stock (Math.max prevents it from ever going into negative numbers)
        product.totalStock = Math.max(0, (product.totalStock || 0) - item.quantity);

        // ✅ NEW: Add to the total sold count!
        product.soldCount = (product.soldCount || 0) + item.quantity;
        
        // If the product has color/size variants, deduct from the specific variant as well
        if (product.variants && product.variants.length > 0) {
          if (item.variant) {
            // Find the exact variant the user bought
            const variantToUpdate = product.variants.find(
              (v: any) => v._id.toString() === item.variant.toString()
            );
            if (variantToUpdate) {
              variantToUpdate.stock = Math.max(0, (variantToUpdate.stock || 0) - item.quantity);
            }
          } else {
            // If no specific variant was passed, just deduct from the first one to keep things synced
            product.variants[0].stock = Math.max(0, (product.variants[0].stock || 0) - item.quantity);
          }
        }

        // Save the freshly updated stock back to the database!
        await product.save();
      }
    }

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