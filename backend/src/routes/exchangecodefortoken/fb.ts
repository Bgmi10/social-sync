import express, { Router } from "express";
import { sendResponse } from "../../utils/helper";
import dotenv from "dotenv";

export const fb = Router();
dotenv.config({ path: "../.env" });

const clientId = process.env.FB_CLIENT;
const clientSecret = process.env.FB_SECRET;

console.log(clientId)

fb.post("/exchangecodefortoken", async (req: express.Request, res: express.Response) => {
    const { token } = req.body; // Keep it secret, backend ideally!
    const redirectUri = `http://localhost:5173/facebook/callback`;

    if (!token) {
        sendResponse(res, 400, "Missing token");
        return
    }

    try {
        const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${token}`;
        const response = await fetch(tokenUrl);
        const data = await response.json();

        if (response.status === 400) {
            sendResponse(res, 400, data.error.message);
            return;
        }
        sendResponse(res, 200, "success", data);

    } catch (e) {
        sendResponse(res, 500, "error while getting accesstoken");
    }
})