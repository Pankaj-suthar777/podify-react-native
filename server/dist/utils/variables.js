"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.JWT_SECRET = exports.SIGN_IN_URL = exports.PASSWORD_RESET_LINK = exports.VERIFICATION_EMAIL = exports.MAILTRAP_PASS = exports.MAILTRAP_USER = exports.MONGO_URI = void 0;
const { env } = process;
exports.MONGO_URI = env.MONGO_URI, exports.MAILTRAP_USER = env.MAILTRAP_USER, exports.MAILTRAP_PASS = env.MAILTRAP_PASS, exports.VERIFICATION_EMAIL = env.VERIFICATION_EMAIL, exports.PASSWORD_RESET_LINK = env.PASSWORD_RESET_LINK, exports.SIGN_IN_URL = env.SIGN_IN_URL, exports.JWT_SECRET = env.JWT_SECRET, exports.CLOUDINARY_CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME, exports.CLOUDINARY_API_KEY = env.CLOUDINARY_API_KEY, exports.CLOUDINARY_API_SECRET = env.CLOUDINARY_API_SECRET;
