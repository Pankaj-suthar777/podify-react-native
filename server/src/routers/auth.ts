import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  EmailVerificationBody,
} from "#/utils/validationSchema";
import { Router } from "express";
import {
  create,
  sendReVerificationToken,
  verfiyEmail,
} from "../controllers/user";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(EmailVerificationBody), verfiyEmail);
router.post("/re-verify-email", sendReVerificationToken);

export default router;
