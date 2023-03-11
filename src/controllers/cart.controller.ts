import { Request, Response } from "express";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";
import { CustomRequest } from "../middleware/ensureAuth";
import Product from "../models/product.model";
import Cart from "../models/cart.model";
import Category from "../models/category.model";

let OriginStock: number | any;

//Test category Connection

const ping = async (req: Request, res: Response) => {
  return ServerStatus.customStatus(res, 200, "Cart Route", "Successfull");
};

/**USER ROUTES */

//-- ADD PRODUCT TO CART
const cart = async (req: Request, res: Response) => {
  try {
    //-- User Logged In INFO
    const userLoggedIn = (req as CustomRequest).user;

    //-- Looks for a cart that is already registered with the logged user
    const getUserCart = await Cart.findOne({ user: userLoggedIn.sub });

    //-- Product ID
    const productId = req.params.id;

    const findProduct = await Product.findById(productId);

    OriginStock = findProduct?.stock.toString;

    // VALIDATES IF PRODUCT EXISTS
    if (!findProduct) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "No Products Found",
        Logging.warn(findProduct)
      );
    } else if (findProduct.stock === 0) {
      return ServerStatus.internal403FORBIDDEN(
        res,
        "Currently this product is out of stock",
        findProduct
      );
    }

    // VALIDATES IF THE CART ALREADY EXISTS
    if (!getUserCart) {
      const data = req.body;

      const validatedData = {
        user: userLoggedIn.sub,
        items: [
          {
            product: productId,
            quantity: data.quantity,
          },
        ],
      };

      const remainingStock =
        parseInt(findProduct.stock.toString()) - data.quantity;

      if (remainingStock < 0) {
        return ServerStatus.internal403FORBIDDEN(
          res,
          "No hay productos Suficientes",
          Logging.info(remainingStock)
        );
      }

      const updateStock = await Product.findByIdAndUpdate(
        productId,
        {
          stock: remainingStock,
        },
        {
          new: true,
        }
      );

      updateStock;

      const newCart = new Cart(validatedData);

      const saveCart = await newCart.save();

      return ServerStatus.internal201CREATED(res, "Added to cart", saveCart);
    }

    //IF VALIDATION FAILS

    const data = req.body;

    /** Callback function that finds an item in the user's cart with a matching 'productId' */
    const existingItem = getUserCart.items.find(
      //-- if the validation is completed it return 'existingIttem as true'
      (item) => item.product.toString() === productId
    );

    //-- Validates if the callback returns true or false

    if (existingItem) {
      // Update the existing item's quantity
      const quantityTotal =
        parseInt(existingItem.quantity) + parseInt(data.quantity);

      const currentProductStock = findProduct.stock.toString();

      const remainingStock = parseInt(currentProductStock) - data.quantity;

      if (remainingStock < 0) {
        return ServerStatus.internal403FORBIDDEN(
          res,
          "No hay productos Suficientes",
          Logging.info(remainingStock)
        );
      }

      const updateStock = await Product.findByIdAndUpdate(
        productId,
        {
          stock: remainingStock,
        },
        {
          new: true,
        }
      );

      updateStock;

      existingItem.quantity = quantityTotal.toString();
    } else {
      // Add a new item to the cart when the validation fails.
      const currentProductStock = findProduct.stock.toString();

      const remainingStock = parseInt(currentProductStock) - data.quantity;

      if (remainingStock < 0) {
        return ServerStatus.internal403FORBIDDEN(
          res,
          "No hay productos Suficientes",
          Logging.info(remainingStock)
        );
      }

      const updateStock = await Product.findByIdAndUpdate(
        productId,
        {
          stock: remainingStock,
        },
        {
          new: true,
        }
      );

      updateStock;
      getUserCart.items.push({ product: productId, quantity: data.quantity });
    }

    // Save the cart
    await getUserCart.save();

    return ServerStatus.internal200OK(res, "Added to cart", getUserCart);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Adding to cart", err);
  }
};

//--SHOW CART
const getCart = async (req: Request, res: Response) => {
  try {
    // User Logged In INFO
    const userLoggedIn = (req as CustomRequest).user;

    const getUserCart = await Cart.findOne({ user: userLoggedIn.sub })
      .populate({ path: "user", select: "username email phone -_id" })
      .populate({ path: "items.product", select: "-_id -category" });

    if (!getUserCart) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "Your cart is empty",
        Logging.warn({ getUserCart })
      );
    }
    return ServerStatus.internal200OK(res, "Your Cart", getUserCart);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Adding to cart", err);
  }
};

//--DELTE CART

const deleteCart = async (req: Request, res: Response) => {
  try {
    // User Logged In INFO
    const userLoggedIn = (req as CustomRequest).user;

    const getUserCartToDelete = await Cart.findOne({ user: userLoggedIn.sub });

    if (!getUserCartToDelete) {
      return ServerStatus.internal404NOTFOUND(
        res,
        "Cart Not Found",
        Logging.error({ getUserCartToDelete })
      );
    }

    const cartItems = getUserCartToDelete.items;

    //--Iterates Between the 'items' array and restores the Stock

    cartItems.forEach(async (item) => {
      const findProduct = await Product.findById(item.product);

      const cartQuantity = item.quantity;

      const stock = findProduct?.stock + cartQuantity;

      const updateStock = await Product.findByIdAndUpdate(
        item.product,
        {
          stock: stock,
        },
        {
          new: true,
        }
      );

      Logging.info(updateStock);
    });

    const deleteCart = await Cart.findOneAndDelete({
      _id: getUserCartToDelete._id,
    });

    return ServerStatus.internal202DELETED(res, "Your has been deleted Cart", [
      { Deleted: deleteCart, CartDeleted: getUserCartToDelete },
    ]);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Deleting to cart", err);
  }
};

export default {
  ping,
  cart,
  getCart,
  deleteCart,
};
