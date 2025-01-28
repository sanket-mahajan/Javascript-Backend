import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Validate video ID
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Check if the like already exists
  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  let responseMessage;
  if (existingLike) {
    // If like exists, remove it
    await Like.findByIdAndDelete(existingLike._id);
    responseMessage = "Video unliked successfully";
  } else {
    // Otherwise, create a like
    await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    responseMessage = "Video liked successfully";
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { videoId, existingLike }, responseMessage));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // Validate comment ID
  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // Check if the like already exists
  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  let responseMessage;
  if (existingLike) {
    // If like exists, remove it
    await Like.findByIdAndDelete(existingLike._id);
    responseMessage = "Comment unliked successfully";
  } else {
    // Otherwise, create a like
    await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    responseMessage = "Comment liked successfully";
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { commentId, existingLike }, responseMessage));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  // Validate tweet ID
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  // Check if the like already exists
  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  let responseMessage;
  if (existingLike) {
    // If like exists, remove it
    await Like.findByIdAndDelete(existingLike._id);
    responseMessage = "Tweet unliked successfully";
  } else {
    // Otherwise, create a like
    await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    responseMessage = "Tweet liked successfully";
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { tweetId, existingLike }, responseMessage));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // Fetch all liked videos for the current user
  const likedVideos = await Like.find({
    likedBy: req.user._id,
    video: { $exists: true },
  })
    .populate("video")
    .select("-__v");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

const getLikedTweets = asyncHandler(async (req, res) => {
  // Fetch all liked videos for the current user
  const likedTweets = await Like.find({
    likedBy: req.user._id,
    tweet: { $exists: true },
  })
    .populate("tweet")
    .select("-__v");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedTweets, "Liked Tweets fetched successfully")
    );
});

const getLikedComments = asyncHandler(async (req, res) => {
  // Fetch all liked videos for the current user
  const likedComments = await Like.find({
    likedBy: req.user._id,
    comment: { $exists: true },
  })
    .populate("comment")
    .select("-__v");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedComments, "Liked Comments fetched successfully")
    );
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getLikedComments,
  getLikedTweets,
};
