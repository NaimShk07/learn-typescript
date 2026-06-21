import { Router } from "express";
import {
  getUsers,
  getUsersById,
  create,
  updateUser,
  deleteUser,
} from "../../controllers/user.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../../schemas/user.schema.js";

const router = Router();

router
  .route("/")
  .get(authenticate, authorize("admin"), asyncHandler(getUsers))
  .post(
    authenticate,
    authorize("user"),
    validate(createUserSchema),
    asyncHandler(create)
  );

router
  .route("/:id")
  .get(authenticate, asyncHandler(getUsersById))
  .put(authenticate, validate(updateUserSchema), asyncHandler(updateUser))
  .delete(authenticate, authorize("admin"), asyncHandler(deleteUser));

export default router;
