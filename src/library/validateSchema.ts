import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import Logging from "./loggin";
import ServerStatus from "./server_status";
import { IUser } from "../models/user.model";

export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (err) {
      Logging.error(`Error Validate Schema [${err}]`);
      ServerStatus.internal500ERROR(
        res,
        "Error validating Schema",
        ValidateSchema
      );
    }
  };
};

export const Schemas = {
  users: {
    create: Joi.object<IUser>({
      password: Joi.string().required(),
    }),
  },
};
