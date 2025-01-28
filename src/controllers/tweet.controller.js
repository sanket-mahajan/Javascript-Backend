import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const getAllTweets = asyncHandler(async (req, res) => {
  const { query, sortBy = "createdAt", sortType = "desc" } = req.query;

  const filter = {};

  if (query) {
    // Find users whose fullname matches the query
    const users = await User.find({
      fullname: { $regex: query, $options: "i" },
    });
    const userIds = users.map((user) => user._id);

    // Filter tweets by content or matching owner IDs
    filter.$or = [
      { content: { $regex: query, $options: "i" } },
      { owner: { $in: userIds } },
    ];
  }

  try {
    const tweets = await Tweet.find(filter)
      .populate("owner", "fullName")
      .sort({ [sortBy]: sortType === "asc" ? 1 : -1 });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          tweets,
        },
        "Tweets fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching Tweets: " + error.message);
  }
});

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Cannot be empty");
  }

  const owner = req.user._id;

  const tweet = await Tweet.create({ content, owner });

  const uploadedTweet = await Tweet.findById(tweet._id);

  return res
    .status(200)
    .json(new ApiResponse(200, uploadedTweet, "Tweet uploaded successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { query, sortBy = "createdAt", sortType = "desc" } = req.query;
  const { userId } = req.params;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Provide valid ID");
  }

  const filter = {};
  filter.owner = userId;
  if (query) filter.$or = [{ content: { $regex: query, $options: "i" } }];
  const userTweet = await Tweet.find(filter)
    .populate("owner", "fullName")
    .sort({ [sortBy]: sortType === "asc" ? 1 : -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { tweets: userTweet }, "Tweets fetched successfully")
    );
});

const getTweetById = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { tweetId } = req.params;
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Provide valid ID");
  }
  const tweet = await Tweet.findById(tweetId).populate(
    "owner",
    "fullName avatar"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid ID");
  }

  if (!content) {
    throw new ApiError(400, "Cannot be empty");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json(new ApiResponse(200, tweet, "Tweet updated"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid ID");
  }

  const tweet = await Tweet.findByIdAndDelete(tweetId);

  res.status(200).json(new ApiResponse(200, tweet, "Tweet deleted"));
});

export {
  createTweet,
  getUserTweets,
  deleteTweet,
  updateTweet,
  getAllTweets,
  getTweetById,
};
