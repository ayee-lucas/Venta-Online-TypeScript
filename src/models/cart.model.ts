import mongoose, { Document, Schema } from "mongoose";

export interface ICart {
  user: string;
  items: [{ product: string; quantity: string }];
  products: string | any;
}

export interface ICartModel extends ICart, Document {}

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICartModel>("Cart", CartSchema);
