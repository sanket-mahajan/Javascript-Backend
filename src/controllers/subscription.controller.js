import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid ID");
  }

  const subsciber = req.user._id;

  const isSubscribed = await Subscription.findOne({
    subsciber,
    channel: channelId,
  });

  let subscription;
  if (!isSubscribed) {
    subscription = await Subscription.create({
      subsciber,
      channel: channelId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, subscription, "Subscribed successfully"));
  } else {
    await Subscription.findByIdAndDelete(isSubscribed._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed successfully"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.find({
    channel: channelId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Fetched all subscribers"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const channels = await Subscription.find({
    subsciber: subscriberId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Fetched all channels"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
