import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ToDo : Use isvalidObjectId also operations on vdo can be done by user only

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = {};

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    filter.owner = userId;
  }

  try {
    const skip = (page - 1) * limit;

    const videos = await Video.find(filter)
      .populate("owner", "fullName")
      .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Video.countDocuments(filter);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videos,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
          },
        },
        "Videos fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching videos" + error.message);
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Enter valid details");
  }

  const videoLocalPath = req.files?.video[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is missing");
  }

  const videoUrl = await uploadOnCloudinary(videoLocalPath);

  // console.log(videoUrl);
  // console.log(videoUrl.url);

  if (!videoUrl.url) {
    throw new ApiError(400, "Error while uploading  video");
  }

  const owner = req.user._id;

  const videoFromDB = await Video.create({
    videoFile: videoUrl.url, //Cloudinary url
    thumbnail: videoUrl.eager[0]?.secure_url, //Cloudinary url
    title, //req -done
    description, //req -done
    duration: videoUrl.duration, //Cloudinary url
    views: 0, // user
    isPublished: true,
    owner, // user - done
  });

  const uploadedVideo = await Video.findById(videoFromDB._id);

  if (!uploadedVideo) {
    throw new ApiError(500, "something went wrong when uploading a vdo");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, uploadedVideo, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if (!videoId) {
    throw new ApiError(400, "Enter Valid ID");
  }

  const view = await Video.findById(videoId);

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        views: view.views + 1,
      },
    },
    {
      new: true,
    }
  ).populate("owner", "fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, video, `video with id ${videoId} fetched`));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Enter valid title and description");
  }

  const thumbnailPath = req.file?.path;

  if (!thumbnailPath) {
    throw new ApiError(400, "Thumbnail file is missing");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailPath);

  if (!thumbnail.url) {
    throw new ApiError(400, "Error while uploading thumbnail");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, video, "Details updated sucessfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!videoId) {
    throw new ApiError(400, "Enter valid ID");
  }

  const del = await Video.findByIdAndDelete(videoId);

  res
    .status(200)
    .json(200, new ApiResponse(200, del, "Video Deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Enter valid ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Enter valid ID");
  }

  const videoPublished = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videoPublished, "Publish satus changed"));
});

const getUploadedVideos = asyncHandler(async (req, res) => {
  const owner = req.user._id;

  const videos = await Video.find({ owner });

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "Videos fetched successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getUploadedVideos,
};
