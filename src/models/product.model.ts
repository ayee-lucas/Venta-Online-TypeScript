import mongoose, { Document, mongo, Schema } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
}

export interface IProductModel extends IProduct, Document {}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      default: "DEFAULT",
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IProductModel>("Product", ProductSchema);
