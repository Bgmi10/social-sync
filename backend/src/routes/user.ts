import { Router } from "express";
import { prisma } from "../prisma/prisma";
import { sendResponse } from "../utils/helper";

export const user = Router();

user.get("/profile", async (req, res) => {
    //@ts-ignore
    const { id } = req.user;
    try {
        const response = await prisma.user.findUnique({
            where: { id },
            select: {
                email: true,
                name: true,
                connections: true
            }
        }); // Add type assertion to any
        sendResponse(res, 200, "success", { user: response });
    } catch (e) {
        console.log(e);
        sendResponse(res, 500, "error while getting profile");
    }
})