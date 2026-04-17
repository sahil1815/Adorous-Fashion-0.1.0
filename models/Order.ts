import mongoose, { Schema, InferSchemaType } from "mongoose";

// ---------------------------------------------------------------------------
// Sub-document schemas
// ---------------------------------------------------------------------------

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: Schema.Types.ObjectId }, 
    name: { type: String, required: true },
    image: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },   
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 }, 
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    // ✅ MADE OPTIONAL for BD addresses
    postalCode: { type: String, required: false },
    // ✅ DEFAULT TO BD
    country: { type: String, required: true, default: "BD" },
    phone: { type: String },
  },
  { _id: false }
);

// ---------------------------------------------------------------------------
// Main order schema
// ---------------------------------------------------------------------------
const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    items: {
      type: [OrderItemSchema],
      validate: {
        validator: (arr: unknown[]) => arr.length > 0,
        message: "An order must contain at least one item",
      },
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "COD", // ✅ Default to COD
    },
    paymentIntentId: { type: String },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 }, 
    total: { type: Number, required: true, min: 0 }, 
    // ✅ DEFAULT TO BDT
    currency: { type: String, default: "BDT", uppercase: true, maxlength: 3 },
    notes: { type: String },           
    trackingNumber: { type: String },  
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
OrderSchema.index({ user: 1, createdAt: -1 }); 
OrderSchema.index({ status: 1 });               
OrderSchema.index({ orderNumber: 1 });          

// ---------------------------------------------------------------------------
// Pre-save hook 
// ---------------------------------------------------------------------------
OrderSchema.pre("save", async function () {
  if (this.isNew && !this.orderNumber) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(10000 + Math.random() * 90000);
    this.orderNumber = `ADR-${date}-${rand}`;
  }
});

export type IOrder = InferSchemaType<typeof OrderSchema>;

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;