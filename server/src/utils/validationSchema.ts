import { isValidObjectId } from "mongoose";
import * as yup from "yup";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing")
    .min(3, "Name is too short!")
    .max(20, "Name is to long!"),

  email: yup.string().required("Email is missing!").email("Invalid email id!"),

  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(5, "password is too short!"),
});

export const EmailVerificationBody = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
});
