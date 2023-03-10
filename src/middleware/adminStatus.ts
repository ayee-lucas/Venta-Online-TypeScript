import { Request, Response, NextFunction } from "express";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";
import { CustomRequest } from "./ensureAuth";

export const isAdmin = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userLoggedIn = (req as CustomRequest).user;
      if (userLoggedIn.role != "ADMIN") {
        return ServerStatus.internal403FORBIDDEN(
          res,
          "Not Authorized",
          userLoggedIn
        );
      }
      next();
    } catch (err) {
      Logging.error(err);
    }
  };
};
