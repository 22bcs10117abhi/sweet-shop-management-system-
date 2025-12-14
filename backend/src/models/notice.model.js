import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    noticeId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type:String,
      lowercase:true,
      trim:true,
      required:true,
    },
    ipfsAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Notice = mongoose.model("Notice", noticeSchema);
