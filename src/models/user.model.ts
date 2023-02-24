import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  name: String;
  surname: String;
  username: String;
  password: String;
  email: String;
  phone: String;
  role: String;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    surname: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "CLIENT",
      uppercase: true,
      enum: ["CLIENT", "ADMIN"],
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IUserModel>("User", UserSchema);
