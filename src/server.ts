import express, { Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import { dbConnect } from "./config/config";
import Logging from "./library/loggin";

const router = express();

async function mongo() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(dbConnect.mongo.uri);
    Logging.info("CONNECTED TO DATABASE");
    StartServer();
  } catch (err) {
    Logging.error("UNABLE CONNECT");
    Logging.error(err);
  }
}

/** Only start the server if Mongo Connects */

const StartServer = () => {
  router.use((req, res, next) => {
    /** Log the request */
    Logging.info(`Incoming -> Method [${req.method}] - [${req.url}]`);

    res.on("finish", () => {
      /** Log the response */
      Logging.info(
        `Incoming -> Method [${req.method}] - [${req.url}] - Status: [${req.statusCode}]`
      );
    });
    next();
  });

  router.use(express.urlencoded({ extended: false }));
  router.use(express.json());
  router.use(cors());
  router.use(helmet());

  /** Routes */

  /** Healthcheck */
  router.get("/ping", (req, res, next) =>
    res.status(200).json({ message: "pong" })
  );

  /** Error handling */
  router.use((req, res, next) => {
    const error = new Error("not found");
    Logging.error(error);

    return res.status(404).json({ message: error.message });
  });

  (async () => {
    try {
      router.listen(dbConnect.server.port);
      Logging.info(`SERVER RUNNING ON ${dbConnect.server.port}`);
    } catch (err) {
      Logging.error("ERROR LISTENING TO PORT");
      Logging.error(err);
    }
  })();
};

mongo();
