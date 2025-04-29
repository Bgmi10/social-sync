import express from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
export const sendResponse = (res: express.Response, status: number, message: string, data?: any) => {
  res.status(status).json({ message: message, data: data });
} 

export const hashPass = async (password: string) => {
  const hashedPassed = await hash(password, 10);
  return hashedPassed;
} 

export const signToken = (userEmail: string, userId: number) => {
  const token = jwt.sign({ email: userEmail, id: userId }, process.env.JWT_SECRET as string, { expiresIn: "10h" });
  return token;
}

export const validPass = async (password: string, encryptPass: string) => {
  const isValid = await compare(password, encryptPass);
  return isValid;
}

export const verifyToken = (token: string) => {
  const isValidToken = jwt.verify(token, process.env.JWT_SECRET as string);
  return isValidToken;
}

export async function ytRefreshToken(refreshToken: string) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    client_id: process.env.YT_CLIENT as string,
    client_secret: process.env.YT_SECRET as string,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  const data = await response.json();
  return data; // Contains new access_token, typically with same 1hr expiration
}