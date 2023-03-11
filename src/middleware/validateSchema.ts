import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";
import { IUser } from "../models/user.model";
import { IProduct } from "../models/product.model";
import { ICategory } from "../models/category.model";

export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      Logging.error(`Error Validate Schema [${err}]`);
      ServerStatus.internal500ERROR(
        res,
        "Error validating Schema  --> CHECK LOGS",
        ValidateSchema
      );
    }
  };
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
    update: Joi.object<IUser>({
      name: Joi.string().optional(),
      surname: Joi.string().optional(),
      username: Joi.string().optional(),
      password: Joi.string().optional(),
      email: Joi.string().optional(),
      phone: Joi.string().optional(),
      role: Joi.string()
        .optional()
        .default("CLIENT")
        .valid("CLIENT", "ADMIN")
        .insensitive(),
    }),
  },
  products: {
    create: Joi.object<IProduct>({
      name: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      price: Joi.number().required(),
      stock: Joi.number().required(),
    }),
    update: Joi.object<IProduct>({
      name: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      price: Joi.number().required(),
    }),
    updateStock: Joi.object<IProduct>({
      stock: Joi.number().required(),
    }),
  },
  category: {
    create: Joi.object<ICategory>({
      name: Joi.string().required(),
      description: Joi.string().required(),
      products: Joi.string().optional(),
    }),
    update: Joi.object<ICategory>({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      products: Joi.string().optional(),
    }),
    showProduct: Joi.object<ICategory>({
      name: Joi.string().required(),
    }),
  },
};
