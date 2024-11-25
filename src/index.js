import "dotenv/config";
import { app } from "./app.js";

import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed", error);
  });

/*
// require("dotenv").config({ path: "./env" });
// import { configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
// import { dotenv } from "dotenv";

// dotenv.config({
//   path: "./env",
// });

// configDotenv();
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERR", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR :", error);
    throw error;
  }
})();

    // app.on((error) => {
    //   console.log("error on express", error);
    //   throw error;
    // });

*/
