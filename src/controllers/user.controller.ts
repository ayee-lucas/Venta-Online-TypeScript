import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import ServerStatus from "../library/server_status";
import Logging from "../library/loggin";
import encrypt from "../library/encrypt";
import utils from "../library/utils";
import JWT from "../library/jwt";
import { token } from "morgan";

let adminStatus: Boolean = false;

const createUser = async (req: Request, res: Response) => {
  const data = req.body;

  utils.deleteEntryBooleanArg(adminStatus, data, "role");

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

const login = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const findedUser = await User.findOne({
      username: data.username,
    });

    let token = JWT.createToken(findedUser);

    return findedUser
      ? ServerStatus.internal200OK(res, "User logged in", token)
      : ServerStatus.internal404NOTFOUND(
          res,
          "Check your credentials user not found",
          data
        );
  } catch (error) {
    ServerStatus.internal500ERROR(res, "Error Creating Token", token);
  }
};

export default { createUser, login, adminStatus };
