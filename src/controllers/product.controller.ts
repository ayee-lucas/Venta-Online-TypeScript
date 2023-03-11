import { NextFunction, Request, Response } from "express";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";
import Product from "../models/product.model";
import Category from "../models/category.model";

const testProduct = (req: Request, res: Response) => {
  return ServerStatus.internal200OK(res, `Product Response`, "OK");
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const product = new Product(data);

    const productSaved = await product.save();

    const productId = productSaved._id.toString();

    Logging.info({ productSaved });

    const findProduct = await Product.findById(productId).populate({
      path: "category",
      select: "-_id -products -__v",
    });

    const updateToCategory = await Category.findOneAndUpdate(
      {
        _id: productSaved.category,
      },
      { $addToSet: { products: productId } },
      {
        new: true,
      }
    );

    updateToCategory;

    ServerStatus.internal200OK(res, "Product Created", findProduct);
  } catch (err) {
    ServerStatus.internal500ERROR(res, "Error Creating Product", err);
  }
};

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findedProducts = await Product.find().populate({
      path: "category",
      select: "-_id -products -__v",
    });
    ServerStatus.internal200OK(res, "Products Found", findedProducts);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Getting Products", err);
  }
};

export default { testProduct, createProduct, getAllProducts };
