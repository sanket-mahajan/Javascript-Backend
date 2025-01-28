import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes

router.route("/:entityId").get(getComments).post(addComment);
router.route("/c/:commentId").patch(updateComment).delete(deleteComment);

export default router;
