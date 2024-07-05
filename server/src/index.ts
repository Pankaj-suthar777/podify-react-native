import express from "express";
import "dotenv/config";
import "./db";

const app = express();

const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log("Port is listing on port " + PORT);
});
