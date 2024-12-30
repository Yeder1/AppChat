import mongoose, { Schema, SchemaTypes } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      min: [8, "Username length must be greater than 8"],
      max: 64,
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    password: {
      min: [8, "Password length must be greater than 8"],
      max: 64,
      type: SchemaTypes.String,
      required: true,
    },
    displayName: SchemaTypes.String,
    avatar: SchemaTypes.String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", UserSchema);
