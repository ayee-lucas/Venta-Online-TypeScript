import { Request, Response } from "express";
import mongoose from "mongoose";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";
import Category from "../models/category.model";
import Product from "../models/product.model";

let DEFAULT_CATEGORY_ID: mongoose.Types.ObjectId | string;

const ping = async (req: Request, res: Response) => {
  return ServerStatus.customStatus(res, 200, "Category Route", "Successfull");
};

const create = async (req: Request, res: Response) => {
  try {
    /**CREATES THE DEFAULT CATEGORY */
    const defaultCategory = {
      name: "Default",
      description: "This is the default category",
    };
    // VALIDATES IF DEFAULT CATEGORY ALREADY EXISTS
    const existingCategory = await Category.findOne({ name: "Default" });
    if (!existingCategory) {
      const newDefaultCategory = new Category(defaultCategory);
      await newDefaultCategory.save();

      Logging.warn("Default category created");
      Logging.warn({ Default: newDefaultCategory });
    } else {
      Logging.warn("Default category already exists");
    }

    /**CREATES CATEGORY */
    const data = req.body;

    delete data.products;

    const newCategory = new Category(data);
    Logging.info(newCategory);

    const savedCategory = await newCategory.save();
    ServerStatus.internal201CREATED(res, "Category created", savedCategory);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Creating Category", err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const categoryFinded = await Category.findOne({ _id: categoryId });

    if (!categoryFinded)
      return ServerStatus.internal404NOTFOUND(
        res,
        "Category Not Found",
        categoryFinded
      );

    Logging.info(categoryFinded?.name);
    const data = req.body;

    delete data.products;

    const updatedCategory = await Category.updateOne(
      { _id: categoryId },
      data,
      { new: true, runValidators: true }
    );

    return ServerStatus.internal200OK(res, "Category Updated", [
      updatedCategory,
      data,
    ]);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Updating Category", err);
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({}, { description: 0, products: 0 });
    return ServerStatus.internal200OK(res, "Categories: ", categories);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Getting Categories", err);
  }
};

const getProducts_Categories = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const productsFinded = await Category.findOne({ name: data.name }).populate(
      {
        path: "products",
        select: "-_id -category",
      }
    );

    if (!productsFinded) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "Category Not Found",
        productsFinded
      );
    }

    if (productsFinded?.products.length == 0) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "There is nothing to show",
        productsFinded
      );
    }

    ServerStatus.internal200OK(res, "Products Found", productsFinded);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error getting Products", err);
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;

    Logging.info(categoryId);

    const categoryToDelete = await Category.findOneAndDelete({
      _id: categoryId,
    });

    if (!categoryToDelete) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "Category Not found",
        Logging.info(categoryToDelete)
      );
    }

    const existingCategory = await Category.findOne({ name: "Default" });

    DEFAULT_CATEGORY_ID = existingCategory?._id;

    Logging.info({ DEFAULT_CATEGORY_ID });

    !DEFAULT_CATEGORY_ID
      ? ServerStatus.internal500ERROR(
          res,
          "Default category is not set",
          DEFAULT_CATEGORY_ID
        )
      : Logging.info("Default Category Check Passed");

    const updateProducts = await Product.updateMany(
      { category: categoryId },
      { category: DEFAULT_CATEGORY_ID }
    );

    ServerStatus.internal200OK(res, "Category Delete Success", updateProducts);
  } catch (err) {
    Logging.error(err),
      ServerStatus.internal500ERROR(res, "Error Deleting category", err);
  }
};

export default {
  ping,
  create,
  update,
  getCategories,
  getProducts_Categories,
  deleteCategory,
};
