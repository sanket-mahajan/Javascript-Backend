import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
  const { entityId } = req.params; // Accept videoId or tweetId
  const { content, parentId } = req.body; // parentId for replies

  if (!entityId || !isValidObjectId(entityId)) {
    throw new ApiError(400, "Invalid videoId or tweetId");
  }

  if (!content) {
    throw new ApiError(400, "Comment content cannot be empty");
  }

  const commentData = {
    content,
    owner: req.user._id,
  };

  if (parentId) {
    // Adding a reply to an existing comment
    if (!isValidObjectId(parentId)) {
      throw new ApiError(400, "Invalid parentId");
    }
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      throw new ApiError(404, "Parent comment not found");
    }
    commentData.replies = [];
    commentData.parent = parentId;
  } else {
    // Adding a comment to a video or tweet
    const isVideo = await mongoose.model("Video").exists({ _id: entityId });
    const isTweet = await mongoose.model("Tweet").exists({ _id: entityId });
    if (isVideo) commentData.video = entityId;
    else if (isTweet) commentData.tweet = entityId;
    else throw new ApiError(400, "Invalid videoId or tweetId");
  }

  const comment = await Comment.create(commentData);

  if (parentId) {
    await Comment.findByIdAndUpdate(parentId, {
      $push: { replies: comment._id },
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const getComments = asyncHandler(async (req, res) => {
  const { entityId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!entityId || !isValidObjectId(entityId)) {
    throw new ApiError(400, "Invalid videoId or tweetId");
  }

  const skip = (page - 1) * limit;

  const query = {
    $or: [{ video: entityId }, { tweet: entityId }],
  };

  const comments = await Comment.find(query)
    .skip(skip)
    .limit(Number(limit))
    .populate("owner replies")
    .populate({
      path: "replies", // Populate the replies
      populate: {
        path: "owner", // Populate the owner inside each reply
      },
    });

  const total = await Comment.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
      "Comments fetched successfully"
    )
  );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  if (!content) {
    throw new ApiError(400, "Comment content cannot be empty");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  const comment = await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully"));
});

export { addComment, getComments, updateComment, deleteComment };
