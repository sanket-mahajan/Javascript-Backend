import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subsciber: {
      types: Schema.Types.ObjectId, //one who subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, //one to whom subscribing
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
