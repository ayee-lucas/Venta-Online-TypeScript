import mongoose, { Document, Schema } from "mongoose";

export interface ICategory {
  name: string;
  description: string;
  products: Array<any>;
}
