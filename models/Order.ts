import mongoose, { Schema, InferSchemaType } from "mongoose";

// ---------------------------------------------------------------------------
// Sub-document schemas
// ---------------------------------------------------------------------------

// Snapshot of a product at purchase time.
// Storing name/image/sku/price here means product edits never corrupt orders.
const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: Schema.Types.ObjectId }, // optional — only if variants exist
    name: { type: String, required: true },
    image: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },   // price at purchase time
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 }, // price × quantity
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
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "US" },
    phone: { type: String },
  },
  { _id: false }
);

// ---------------------------------------------------------------------------
// Main order schema
// ---------------------------------------------------------------------------
const OrderSchema = new Schema(
  {
    // Human-readable ID shown to customers, e.g. "ADR-20240318-47291"
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // null = guest checkout
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

    // Fulfillment lifecycle
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },

    // Payment lifecycle (separate from fulfillment)
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      required: true,
      default: "stripe",
    },

    // Stripe PaymentIntent ID — used for reconciliation and refunds
    paymentIntentId: { type: String },

    // Pricing breakdown (all in `currency`, major units e.g. USD dollars)
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 }, // coupon / promo amount
    total: { type: Number, required: true, min: 0 }, // subtotal + shipping + tax - discount

    currency: { type: String, default: "USD", uppercase: true, maxlength: 3 },

    notes: { type: String },           // customer note at checkout
    trackingNumber: { type: String },  // added when shipped
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
OrderSchema.index({ user: 1, createdAt: -1 }); // "my orders" page
OrderSchema.index({ status: 1 });               // admin order management
OrderSchema.index({ orderNumber: 1 });          // order lookup / confirmation email

// ---------------------------------------------------------------------------
// Pre-save hook — auto-generate a human-readable order number on creation
// Format: ADR-YYYYMMDD-XXXXX
// ---------------------------------------------------------------------------
OrderSchema.pre("save", async function () {
  if (this.isNew && !this.orderNumber) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(10000 + Math.random() * 90000);
    this.orderNumber = `ADR-${date}-${rand}`;
  }
});

// ---------------------------------------------------------------------------
// Type + Model
// ---------------------------------------------------------------------------
export type IOrder = InferSchemaType<typeof OrderSchema>;

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;