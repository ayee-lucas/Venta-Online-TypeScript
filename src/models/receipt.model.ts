import mongoose, { Document, Schema } from "mongoose";

export interface IRecipt {
  items: [{ product: string; quantity: string }];
  total: string | number;
  user: string;
}

export interface IReciptModel extends IRecipt, Document {}

const ReceiptSchema = new Schema(
  {
    items: [
      /*{

        type: Schema.Types.ObjectId,
        ref: "Cart",
       
        product: {
          type: Schema.Types.ObjectId,
          ref: "Cart",
          required: true,
        },
                 quantity: {
          type: Schema.Types.ObjectId,
          ref: "Cart",
          required: true,
        },
        price: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, 
      },*/
    ],
    total: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRecipt>("Receipt", ReceiptSchema);
