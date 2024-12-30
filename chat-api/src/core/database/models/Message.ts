import mongoose, { Schema, SchemaTypes } from "mongoose";

const MessageSchema = new Schema(
  {
    conversation: {
      type: SchemaTypes.ObjectId,
      ref: "conversations",
      required: true,
    },
    content: {
      type: SchemaTypes.String,
      required: true,
    },
    sender: {
      type: SchemaTypes.ObjectId,
      ref: "users",
      required: true,
    },
    seenBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        seenAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("messages", MessageSchema);
