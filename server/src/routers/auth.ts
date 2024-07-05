import { validate } from "#/middleware/validator";
import { CreateUserSchema } from "#/utils/validationSchema";
import { Router } from "express";
import { create } from "../controllers/user";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

export default router;
