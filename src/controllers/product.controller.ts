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
    const validateCategory = await Category.findOne({ _id: data.category });
    if (!validateCategory)
      return ServerStatus.internal404NOTFOUND(
        res,
        "Category not Found",
        product
      );
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

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const findedProducts = await Product.find().populate({
      path: "category",
      select: "-_id -products -__v",
    });

    if (!findedProducts)
      return ServerStatus.internal404NOTFOUND(
        res,
        "No products found",
        findedProducts
      );

    ServerStatus.internal200OK(res, "Products Found", findedProducts);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Getting Products", err);
  }
};

//EDIT

const editProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const productId = req.params.id;

    Logging.info(data);

    const findProductToEdit = await Product.findById(productId);

    if (!findProductToEdit)
      return ServerStatus.internal404NOTFOUND(
        res,
        "No Products Found",
        findProductToEdit
      );

    const validateCategory = await Category.findOne({ name: data.category });

    Logging.info(validateCategory);

    if (!validateCategory)
      return ServerStatus.internal404NOTFOUND(
        res,
        "Category not Found",
        findProductToEdit
      );

    const validatedProductData = {
      name: data.name,
      description: data.description,
      category: validateCategory._id,
      price: data.price,
    };

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      validatedProductData,
      {
        new: true,
      }
    );

    const updateToCategory = await Category.findOneAndUpdate(
      {
        _id: validateCategory._id,
      },
      { $addToSet: { products: productId } },
      {
        new: true,
      }
    );

    updateToCategory;

    Logging.warn({ findProductToEdit });

    ServerStatus.internal200OK(res, "Products Update Success", updateProduct);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Updating Product", err);
  }
};

/**DELETE STOCK */

const editStock = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const productId = req.params.id;

    const findProductToEdit = await Product.findById(productId);

    if (!findProductToEdit)
      return ServerStatus.internal404NOTFOUND(
        res,
        "No Products Found",
        findProductToEdit
      );

    const updateStock = await Product.findByIdAndUpdate(productId, data, {
      new: true,
    });

    Logging.info(data);

    ServerStatus.internal200OK(res, "Stock Update Success", updateStock);
  } catch (err) {
    ServerStatus.internal500ERROR(res, "Error Updating Stock", err);
  }
};

const getOutOfStock = async (req: Request, res: Response) => {
  try {
    const getProducts = await Product.find({ stock: { $lte: 0 } });

    Logging.warn(getProducts);

    if (getProducts.length == 0) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "There are no out of stock products",
        getProducts
      );
    }

    ServerStatus.internal200OK(res, "Products Found", getProducts);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Getting Products", err);
  }
};

/* const getBestSales = async (req: Request, res: Response) => {
  try {
    const getProducts = await Product.find({ stock: { $lte: 0 } });

    Logging.warn(getProducts);

    if (getProducts.length == 0) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "There are no out of stock products",
        getProducts
      );
    }

    ServerStatus.internal200OK(res, "Products Found", getProducts);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Getting Products", err);
  }
}; */

/**DELETE PRODUCT */

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    Logging.info(productId);

    const productToDelete = await Product.findOne({
      _id: productId,
    });

    if (!productToDelete) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "Product not found",
        Logging.warn({ productToDelete })
      );
    }

    const categoryId = productToDelete?.category;

    const categoryUpdate = await Category.findOneAndUpdate(
      { _id: categoryId },
      { $pull: { products: productId } },
      { new: true }
    );

    if (!categoryUpdate) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "Category Not found",
        Logging.info({ categoryUpdate })
      );
    }

    const deleteProduct = await Product.findOneAndDelete({ _id: productId });

    ServerStatus.internal200OK(res, "Product Delete Success", [
      deleteProduct,
      categoryUpdate,
    ]);
  } catch (err) {
    Logging.error(err),
      ServerStatus.internal500ERROR(res, "Error Deleting category", err);
  }
};

const getProductsByName = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const searchData = data.search.toString();

    const regex = new RegExp(searchData, "i");

    const findedProducts = await Product.find({
      name: { $regex: regex },
    }).populate({
      path: "category",
      select: "-_id -products -__v",
    });

    if (!findedProducts)
      return ServerStatus.internal404NOTFOUND(
        res,
        "No products found",
        findedProducts
      );

    ServerStatus.internal200OK(res, "Products Found", findedProducts);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Getting Products", err);
  }
};

export default {
  testProduct,
  createProduct,
  getAllProducts,
  editProduct,
  editStock,
  getOutOfStock,
  deleteProduct,
  getProductsByName,
};
