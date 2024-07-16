import express from "express";
import "dotenv/config";
import "express-async-errors";
import "./db";
import "./utils/schedule";

import authRouter from "./routers/auth";
import audioRouter from "./routers/audio";
import playlistRouter from "./routers/playlist";
import profileRouter from "./routers/profile";
import historyRouter from "./routers/history";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/playlist", playlistRouter);
app.use("/profile", profileRouter);
app.use("/history", historyRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log("Port is listing on port " + PORT);
});
