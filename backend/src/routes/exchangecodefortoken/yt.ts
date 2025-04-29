import express, { Router } from "express";
import { sendResponse } from "../../utils/helper";
import dotenv from "dotenv";

const yt = Router();
dotenv.config({ path: "../.env" });

const clientId = process.env.YT_CLIENT;
const clientSecret = process.env.YT_SECRET;

yt.post("/exchangecodefortoken", async (req: express.Request, res: express.Response) => {
    const { token } = req.body;
    const redirectUri = `http://localhost:5173/youtube/callback`;

    if (!token) {
        sendResponse(res, 400, "Missing token");
        return;
    }

    try {
        const tokenUrl = `https://oauth2.googleapis.com/token?client_id=${clientId}&client_secret=${clientSecret}&code=${token}&redirect_uri=${encodeURIComponent(redirectUri)}&grant_type=authorization_code`;
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const data = await response.json();

        if (!response.ok) {
            sendResponse(res, response.status, data.error_description || data.error);
            return;
        }
        
        sendResponse(res, 200, "success", data);
    } catch (e) {
        console.log(e);
        sendResponse(res, 500, "Error while getting access token");
    }
});

export default yt;