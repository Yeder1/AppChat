import mongoose, { Schema, SchemaTypes } from "mongoose";

const ConversationSchema = new Schema(
  {
    name: {
      type: SchemaTypes.String,
      required: false,
    },
    isGroup: {
      type: SchemaTypes.Boolean,
      required: true,
      default: false,
    },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("conversations", ConversationSchema);
