import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import ServerStatus from "../library/server_status";
import Logging from "../library/loggin";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;

  const user = new User(data);

  console.log(user);

  const saveUser = await user.save().catch((error) => {
    Logging.error(error);
    ServerStatus.internal500ERROR(res, "Error Saving User", { user, error });
  });

  return ServerStatus.internal200OK(res, "User saved", saveUser);
};

export default { createUser };
