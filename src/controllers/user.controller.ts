import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";

const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    data,
  });
};
