import mongoose, { Schema, InferSchemaType } from "mongoose";

const NotificationSchema = new Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ["profile_update", "new_order", "system"],
      default: "system" 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

export type NotificationType = InferSchemaType<typeof NotificationSchema>;

const Notification = mongoose.models.Notification || mongoose.model<NotificationType>("Notification", NotificationSchema);
export default Notification;