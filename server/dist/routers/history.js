"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const history_1 = require("#/controllers/history");
const auth_1 = require("#/middleware/auth");
const validator_1 = require("#/middleware/validator");
const validationSchema_1 = require("#/utils/validationSchema");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", auth_1.mustAuth, (0, validator_1.validate)(validationSchema_1.UpdateHistorySchema), history_1.updateHistory);
router.delete("/", auth_1.mustAuth, history_1.removeHistory);
router.get("/", auth_1.mustAuth, history_1.getHistories);
router.get("/recently-played", auth_1.mustAuth, history_1.getRecentlyPlayed);
exports.default = router;
