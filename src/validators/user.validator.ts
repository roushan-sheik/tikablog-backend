import { z } from "zod";

const registerUser = z.object({
  body: z.object({
    name: z
      .string("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    email: z
      .string("Email is required")
      .email("Please provide a valid email address"),
    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(24, "Password cannot exceed 128 characters"),

    bio: z
      .string()
      .min(12)
      .max(500, "Bio cannot exceed 500 characters")
      .optional(),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z
      .string("Email is required")
      .email("Please provide a valid email address"),
    password: z.string("Password is required").min(1, "Password is required"),
  }),
});

export const userValidators = {
  registerUser,
  loginUser,
};
