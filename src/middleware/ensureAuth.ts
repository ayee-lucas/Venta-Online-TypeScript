import { Request, Response, NextFunction } from "express";
import JWT, { Secret, JwtPayload } from "jsonwebtoken";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";

export interface CustomRequest extends Request {
  user: string | JwtPayload;
}

export const ensureAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      const err = new Error("Needs Authorization");
      Logging.warn(err);
      return ServerStatus.internal403FORBIDDEN(res, "No content", err);
    } else {
      try {
        let token: any = req.headers.authorization.replace(/['"]/g, "");

        var decoded = JWT.verify(token, `${process.env.SECRET_KEY}`);

        var payload: any = decoded;

        if (Math.floor(Date.now() / 1000) >= payload.exp) {
          const err = new Error("Error validating token");
          Logging.error(err);
          return ServerStatus.internal403FORBIDDEN(res, "Expired Token", err);
        }
      } catch (err) {
        //
        Logging.error(err);
        return ServerStatus.internal500ERROR(
          res,
          "Error in token middleware",
          err
        );
        //
      }

      (req as CustomRequest).user = payload;
      next();
    }
  };
};
