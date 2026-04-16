// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order"; 

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> } // NEXT 16 FIX: params is a Promise
) {
  try {
    await connectDB();
    
    // We must await the params object before reading the ID!
    const { id } = await props.params; 
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { id } = await props.params;

    // --- NEW SECURITY CHECK FOR STATUS UPDATES ---
    if (body.status) {
      const validStatuses = [
        "processing", 
        "accepted", 
        "in_transit", 
        "ready_for_delivery", 
        "delivered", 
        "returned",
        "cancelled" // ✅ Added Cancelled here!
      ];
      
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status update. Must be a valid lifecycle stage." }, 
          { status: 400 }
        );
      }
    }
    // ---------------------------------------------
    
    // Update the order with the validated body
    const order = await Order.findByIdAndUpdate(id, body, { new: true });
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}