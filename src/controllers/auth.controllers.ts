import { authServices } from "../services/auth.service.js";
import type { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catch.async.js";
import successResponse from "../utils/success.response.js";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = await authServices.createUserIntoDB(req.body);

  return successResponse({
    res,
    code: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);
  console.log(result);
  res.status(200).json({ login: "Success" });
});

export const authControllers = {
  registerUser,
  loginUser,
};
