import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  getUploadedVideos,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/getAllVideos").get(verifyJWT, getAllVideos);

router.route("/upload-video").post(
  verifyJWT,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/getVideoById/:videoId").get(verifyJWT, getVideoById);

router
  .route("/updateDetails/:videoId")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo); //TODO : Video can only be updated by Owner

router.route("/deleteVideo/:videoId").delete(verifyJWT, deleteVideo); //TODO : Video can only be deleted by Owner

router
  .route("/updatePublishStatus/:videoId")
  .patch(verifyJWT, togglePublishStatus);

router.route("/getUploadedVideos").get(verifyJWT, getUploadedVideos);

export default router;
