import { authServices } from "../services/auth.service.js"
import type{ Response, Request } from "express"

const getSingleUserById = (req:Request, res:Response)=>{
  const user = authServices.getSingleUserById()
  res.status(200).json(user)
  
}

export const authControllers =  {
getSingleUserById
} 