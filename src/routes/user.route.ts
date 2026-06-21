import { Router } from "express";
import {
  getUsers,
  getUsersById,
  create,
  updateUser,
  deleteUser,
  loginUser,
  signUser,
  refreshToken,
  logout,
} from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", asyncHandler(signUser));
router.post("/login", asyncHandler(loginUser));
router.post("/refresh", asyncHandler(refreshToken));

router
  .route("/")
  .get(authenticate, authorize("admin"), asyncHandler(getUsers))
  .post(authenticate, authorize("user"), asyncHandler(create));

router
  .route("/:id")
  .get(authenticate, asyncHandler(getUsersById))
  .put(authenticate, asyncHandler(updateUser))
  .delete(authenticate, authorize("admin"), asyncHandler(deleteUser));

router.post("/logout", authenticate, asyncHandler(logout));

export default router;
