import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import ServerStatus from "../library/server_status";
import Logging from "../library/loggin";
import encrypt from "../library/encrypt";
import utils from "../library/utils";
import JWT from "../library/jwt";
import { token } from "morgan";
import { CustomRequest } from "../middleware/ensureAuth";

let adminStatus: Boolean = false;

Logging.warn({ adminStatus: adminStatus });

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
      ? ServerStatus.internal200OK(res, "User logged in", [findedUser, token])
      : ServerStatus.internal404NOTFOUND(
          res,
          "Check your credentials user not found",
          data
        );
  } catch (error) {
    return ServerStatus.internal500ERROR(res, "Error Creating Token", token);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const userToUpdateId = req.params.id;
    const loggedInUser = (req as CustomRequest).user;
    const user = { loggedInUser };
    let data = req.body;

    Logging.warn({ userLogged: user });
    Logging.warn({ adminStatus });

    if (userToUpdateId !== user.loggedInUser.sub && !adminStatus) {
      return ServerStatus.internal403FORBIDDEN(
        res,
        "You can only update your Own user",
        user
      );
    }

    const findUserToUpdate = await User.findOne({
      _id: userToUpdateId,
    });

    if (!findUserToUpdate) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "user not found",
        findUserToUpdate
      );
    }

    Logging.warn({ UserToUpdate: findUserToUpdate });

    if (adminStatus && findUserToUpdate?.role == "ADMIN") {
      return ServerStatus.internal403FORBIDDEN(
        res,
        "You can not update an admin user",
        user
      );
    }

    utils.deleteEntryBooleanArg(adminStatus, data, "role");
    utils.deleteEntryBooleanArg(adminStatus, data, "password");

    Logging.warn({ data: data });

    const updateUserFinded = await User.updateOne(
      { _id: userToUpdateId },
      data,
      { new: true }
    );

    return ServerStatus.internal200OK(res, "User Updated Successfully", [
      updateUserFinded,
      { findUserToUpdate },
    ]);
  } catch (err) {
    Logging.error(err);
    return ServerStatus.internal500ERROR(res, "Error Updating User", err);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userToDeleteId = req.params.id;
    const userLoggedIn = { user: (req as CustomRequest).user };
    const findUserToDelete = await User.findOne({ _id: userToDeleteId });

    Logging.warn({ findUserToDelete });
    Logging.warn({ userLoggedIn });

    if (!findUserToDelete) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "user not found",
        findUserToDelete
      );
    }

    if (userToDeleteId !== userLoggedIn.user.sub && !adminStatus) {
      return ServerStatus.internal403FORBIDDEN(
        res,
        "You can only update your Own user",
        userLoggedIn
      );
    }

    if (adminStatus && findUserToDelete?.role == "ADMIN") {
      return ServerStatus.internal403FORBIDDEN(
        res,
        "You can not update an admin user",
        userLoggedIn
      );
    }

    const userFindedId = findUserToDelete?._id.toString();

    Logging.warn({ _id: userFindedId });

    const deleteUser = await User.deleteOne({ _id: findUserToDelete });

    return ServerStatus.internal200OK(res, "User Deleted", [
      findUserToDelete,
      {
        deleteUser,
      },
    ]);
  } catch (err) {
    Logging.error(err);
    return ServerStatus.internal500ERROR(res, "Error Deleting User", err);
  }
};

export default { createUser, login, update, deleteUser, adminStatus };
