import express, { Router } from "express";
import { loginSchema, signupSchema } from "../validator/authSchema";
import { validator } from "../middlewares/validator";
import { prisma } from "../prisma/prisma";
import { hashPass, sendResponse, signToken, validPass } from "../utils/helper";

export const auth = Router();

//@ts-ignore
auth.post("/signup", validator(signupSchema), async (req: express.Request, res: express.Response, next) => {
    
    const isUserExist = await prisma.user.findUnique({
      where: { email: req.body.email }
    }); 

    if (isUserExist) {
      sendResponse(res, 400, "User already exist");
      return;
    }
       
    try {
        const hashedPassed = await hashPass(req.body.password);
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassed,
            }
        });

        if (!user) {
            sendResponse(res, 400, "error while creating user");
            return;
        }

        //@ts-ignore
        const token = signToken(user.email, user.id);
        res.cookie("token", token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           sameSite: "strict",
           path: "/"
        });
        sendResponse(res, 200, "User signed up success!");
    } catch (e) {
        console.log(e);
        sendResponse(res, 500, "error while signup user");
    }
    
});

//@ts-ignore
auth.post("/login", validator(loginSchema), async (req: express.Request, res: express.Response) => {
    try{
        const existUser = await prisma.user.findUnique({
            where: { email: req.body.email }
        });
    
        if (!existUser) {
          sendResponse(res, 400, "User not found!");
          return;
        }
    
        const isValidPassword = await validPass(req.body.password, existUser.password);
    
        if (!isValidPassword) {
           sendResponse(res, 400, "Invalid Credentials");
           return;
        }
      const token = signToken(existUser.email, existUser.id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
      });
      sendResponse(res, 200, "User Authorized!");
    } catch (e) {
        console.log(e);
        sendResponse(res, 500, "Error while login");``
    }
})