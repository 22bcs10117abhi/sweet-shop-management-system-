import mongoose from "mongoose";

const nonceSchema = new mongoose.Schema(
  {
    nonce: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
  },
  { timestamps: true }
);

export const Nonce = mongoose.model("Nonce", nonceSchema);
