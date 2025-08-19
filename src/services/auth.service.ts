import User from "../schemas/user.schema.js";
import type { TUser, TUserLogin, TUserResponse } from "../Types/user.types.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/api.error.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const createUserIntoDB = async (payload: TUser): Promise<TUserResponse> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(
      "User already exists with this email",
      StatusCodes.CONFLICT
    );
  }

  // Create new user (password will be hashed by pre-save hook)
  const newUser = await User.create(payload);

  // Return user without password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword as TUserResponse;
};

const loginUser = async (payload: TUserLogin) => {
  // find user by email
  const user = await User.findOne({ email: payload.email }).select(
    "+password +refreshToken"
  );
  if (!user) {
    throw new ApiError("User not found", StatusCodes.NOT_FOUND);
  }
  // check is password match
  const isPasswordMatch = await user.comparePassword(payload.password);
  if(!isPasswordMatch) {
    throw new ApiError("Invalid email or password", StatusCodes.UNAUTHORIZED)
  }
  // generate token 
 
  const jwtPayload = {
    email: user.email,
  }
 
  const accessToken = jwt.sign(jwtPayload,config.JWT_ACCESS_SECRET as string, {expiresIn: config.JWT_ACCESS_EXPIRY} )

   
};

export const authServices = {
  createUserIntoDB,
  loginUser,
};
