import { Request, Response } from "express";
import Logging from "../library/loggin";
import ServerStatus from "../library/server_status";
import { CustomRequest } from "../middleware/ensureAuth";
import Receipt from "../models/receipt.model";
import Cart from "../models/cart.model";

/** TEST CONNECTION */
const ping = async (req: Request, res: Response) => {
  return ServerStatus.customStatus(res, 200, "Bill Route", "Successfull");
};

/**USER ROUTES */

//CREATE
const buy = async (req: Request, res: Response) => {
  try {
    const userLoggedIn = (req as CustomRequest).user;
    //--  Gets User Cart
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

    const [cartItems] = getUserCart.items;

    let totalPrice = 0;

    getUserCart.items.forEach((item: any) => {
      totalPrice += item.product.price * item.quantity;
    });

    const receiptData = {
      total: totalPrice,
      user: userLoggedIn.sub,
    };

    const newReceipt = new Receipt(receiptData);

    newReceipt.items.push(cartItems);

    const saveReceipt = await newReceipt.save();

    const EmptyCart = await Cart.findOneAndDelete({ user: userLoggedIn.sub });

    ServerStatus.internal200OK(res, "Transaction Completed", [
      { saveReceipt, EmptyCart },
    ]);
  } catch (err) {
    Logging.error(err),
      ServerStatus.internal500ERROR(
        res,
        "Error Any Transactions Done",
        Logging.error(err)
      );
  }
};

//GET

const getReceipts = async (req: Request, res: Response) => {
  try {
    const userLoggedIn = (req as CustomRequest).user;
    const findReceipt = await Receipt.find({ user: userLoggedIn.sub })
      .populate({
        path: "user",
        select: "-_id name surname username email phone",
      })
      .populate({ path: "items" });
    ServerStatus.internal200OK(res, "Receipts Found", findReceipt);
  } catch (err) {
    Logging.error(err);
    ServerStatus.internal500ERROR(res, "Error Getting Receipts", "a");
  }
};

export default {
  ping,
  buy,
  getReceipts,
};
