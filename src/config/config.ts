import dotenv from "dotenv";
import mongoose, { Query } from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3200;

export const dbConnect = {
  mongo: {
    uri: MONGO_URI,
  },
  server: {
    port: SERVER_PORT,
  },
};
