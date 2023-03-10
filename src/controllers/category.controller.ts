import { Request, Response } from "express";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";
import Category from "../models/category.model";

const ping = async (req: Request, res: Response) => {
  return ServerStatus.customStatus(res, 200, "Category Route", "Successfull");
};

const create = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    delete data.products;
    const newCategory = new Category(data);
    Logging.info(newCategory);
    const savedCategory = await newCategory.save();
    ServerStatus.internal200OK(res, "Category created", savedCategory);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Creating Category", err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const categoryFinded = await Category.findOne({ _id: categoryId });

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
    let data = req.body;
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Updating Category", err);
  }
};

export default { ping, create, update };
