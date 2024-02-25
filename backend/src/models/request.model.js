import mongoose from "mongoose";

const requestSchema = mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.ObjectId,
      default: mongoose.Types.ObjectId,
    },
    targetId: {
      type: mongoose.Schema.ObjectId,
      default: mongoose.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    // make sures to update the latest document version (kindof db transactions)
    // optimisticConcurrency: true,
  }
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
