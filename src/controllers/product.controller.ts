import { Request, Response } from "express";
import ServerStatus from "../library/server_status";
import Product from "../models/product.model";

const testProduct = (req: Request, res: Response) => {
  return ServerStatus.internal200OK(res, `Product Response`, "OK");
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const product = new Product(data);

    await product.save();

    ServerStatus.internal200OK(res, "Success", "OK");
  } catch (err) {
    ServerStatus.internal500ERROR(res, "Error Creating Product", err);
  }
};

export default { testProduct, createProduct };
