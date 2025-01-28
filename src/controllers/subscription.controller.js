import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Toggle subscription to a channel
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid or missing channel ID");
  }

  const subscriber = req.user._id;

  // Check if the subscription already exists
  const oldSubscription = await Subscription.findOneAndDelete({
    subscriber,
    channel: channelId,
  });

  if (oldSubscription) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed successfully"));
  }

  // Create a new subscription if it doesn't exist
  const subscription = await Subscription.create({
    subscriber,
    channel: channelId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Subscribed successfully"));
});

// Get the list of subscribers for a specific channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid or missing channel ID");
  }

  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "fullName avatar _id")
    .exec();

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Fetched all subscribers"));
});

// Get the list of channels the user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid or missing subscriber ID");
  }

  const channels = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "fullName avatar _id") // Assuming the channel model has `name` and `avatar` fields
    .exec();

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Fetched all subscribed channels"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
