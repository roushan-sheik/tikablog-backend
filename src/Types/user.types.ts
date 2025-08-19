export type TUser = {
  name: string;
  email: string;
  password?: string; // stored hashed, omit in responses
  profileImage?: string; // URL from Cloudinary
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
