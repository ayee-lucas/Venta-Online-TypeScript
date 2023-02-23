import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import ServerStatus from "../library/server_status";
import Logging from "../library/loggin";
import encrypt from "../library/encrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;

  data.password = await encrypt(data.password).catch((err) => {
    Logging.error(`Error With Encrypt Function [${err}]`);
    ServerStatus.internal500ERROR(res, "Error encrypt function", {
      password: data.password,
    });
  });

  const user = new User(data);

  console.log(user);

  const saveUser = await user.save().catch((error) => {
    Logging.error(error);
    ServerStatus.internal500ERROR(res, "Error Saving User", { user, error });
  });

  return ServerStatus.internal200OK(res, "User saved", saveUser);
};

export default { createUser };
