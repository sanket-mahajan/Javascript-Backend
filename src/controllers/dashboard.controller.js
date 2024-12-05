import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { _id } = req.user._id;
  const channelId = _id;
  // Validate channel ID
  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  // Get total subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  // Get total videos uploaded by the channel
  const videos = await Video.find({ channel: channelId });
  const totalVideos = videos.length;

  // Calculate total likes across all videos
  const totalLikes = await Like.countDocuments({
    video: { $in: videos.map((video) => video._id) },
  });

  // Calculate total views across all videos
  const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalSubscribers, totalVideos, totalLikes, totalViews },
        "Channel stats fetched successfully"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { _id } = req.user._id;
  const channelId = _id;

  // Validate channel ID
  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  // Fetch videos uploaded by the channel
  const videos = await Video.find({ channel: channelId });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
