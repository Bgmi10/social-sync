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
        const response = await prisma.connection.upsert({
            where: { userId_mediaName: {
             mediaName: req.body.mediaName,
             userId: id
            }},
            create: {
             accessToken: req.body.access_token,
             expiresIn: req.body.expires_in,
             mediaName: req.body.mediaName,
             userId: id,
             refreshToken: req.body.refresh_token 
            },
            update: {
             accessToken: req.body.access_token,
             expiresIn: req.body.expires_in,
             refreshToken: req.body.refresh_token
            }
        });

        sendResponse(res, 200, "success");
    } catch (e) {
        console.log(e);
        sendResponse(res, 500, "error while creating connection");
    }
});

connectMedia.delete("/connect-media", async (req: express.Request, res: express.Response) => {
    const { id } = req.body;

    if (!id) {
        sendResponse(res, 400, "Missing body");
        return;
    }

    try {
        const response = await prisma.connection.delete({
            where: { id: parseInt(id) }
        });

        sendResponse(res, 200, "success");

    } catch (e) {
        console.log(e);
        sendResponse(res, 500, "error while deleting connections")
    }
})