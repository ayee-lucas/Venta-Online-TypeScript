import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";
import { IUser } from "../models/user.model";
import userController from "../controllers/user.controller";

const isAdmin: Boolean = userController.adminStatus;

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

const roleValidation = (adminStatus: Boolean) => {
  if (adminStatus) {
    return Joi.object({ role: Joi.string().default("CLIENT").forbidden() });
    //return { role: Joi.string().default("CLIENT").forbidden() };
  } else {
    return Joi.object({ role: Joi.string().required() });
    //return { role: Joi.string().required() };
  }
};

export const Schemas = {
  users: {
    create: Joi.object<IUser>({
      name: Joi.string().required(),
      surname: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      role: Joi.string().optional().default("CLIENT"),
    }),
    login: Joi.object<IUser>({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
};
