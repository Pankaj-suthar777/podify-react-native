import express from "express";
import "dotenv/config";
import "./db";

import authRouter from "./routers/auth";
import audioRouter from "./routers/audio";
import playlistRouter from "./routers/playlist";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/playlist", playlistRouter);

const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log("Port is listing on port " + PORT);
});
