import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  TokenAndIDValidation,
  UpdatePassowrdSchema,
} from "#/utils/validationSchema";
import { Router } from "express";
import {
  create,
  grantValid,
  generateForgetPasswordLink,
  sendReVerificationToken,
  verfiyEmail,
  updatePassword,
} from "../controllers/user";
import { isValidPassResetToken } from "#/middleware/auth";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verfiyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forgot-password", generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  isValidPassResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePassowrdSchema),
  isValidPassResetToken,
  updatePassword
);

export default router;
