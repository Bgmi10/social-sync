import express from "express";
import { sendResponse, verifyToken } from "../utils/helper";

export function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
   const cookie = req.cookies;
   const token = cookie.token;

   if (!token) {
    sendResponse(res, 400, "Unauthorized");
    return;
   }

   const isValidToken = verifyToken(token);

   if (!isValidToken) {
    sendResponse(res, 400, "token invalid");
    return;
   }
   console.log(isValidToken);
   //@ts-ignore
   req.user = isValidToken;
   next()
}  