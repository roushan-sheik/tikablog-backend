import type { Document } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string; // stored hashed, omit in responses
  profileImage?: string; // URL from Cloudinary
  bio?: string;
  refreshToken?: string;
};

// Add instance methods here
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Combine with Document
export interface IUser extends TUser, Document, IUserMethods {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TUserResponse = Omit<TUser, "password"> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TUserLogin = {
  email: string;
  password: string;
};
