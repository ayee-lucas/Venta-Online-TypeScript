/** Server App Dependencies */

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import Logging from "./library/loggin";
import ServerStatus from "./library/server_status";
import { dbConnect } from "./config/config";

/** Import Routes */

import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";

const router = express();

/** Connection to Database */

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
  router.use((req: Request, res: Response, next: NextFunction) => {
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

  router.use("/users", userRoutes);
  router.use("/products", productRoutes);
  router.use("/category", categoryRoutes);

  /** Healthcheck */
  router.get("/ping", (req: Request, res: Response, next: NextFunction) =>
    ServerStatus.internal200OK(res, "Running", "")
  );

  /** Error handling */
  router.use((req: Request, res: Response, next: NextFunction) => {
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
