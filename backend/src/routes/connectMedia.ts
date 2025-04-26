import  express, { Router } from "express";
import { validator } from "../middlewares/validator";
import { collectionSchema } from "../validator/collectionSchema";
import { prisma } from "../prisma/prisma";
import { sendResponse } from "../utils/helper";

export const connectMedia = Router();

//@ts-ignore
connectMedia.post("/connect-media", validator(collectionSchema), async (req: express.Request, res: express.Response) => {
    //@ts-ignore
   const { id } = req.user;
   try {
        const response = await prisma.connection.create({
            data: {
                accessToken: req.body.access_token,
                expiresIn: req.body.expires_in,
                mediaName: req.body.mediaName,
                userId: id
            }
        });

        sendResponse(res, 200, "success");
    } catch (e) {
        console.log(e);
        sendResponse(res, 500, "error while creating connection");
    }
})