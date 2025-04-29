import express, { Router } from "express";
import { sendResponse } from "../utils/helper";
import dotenv from "dotenv";

export const socialMediaRouter = Router();
dotenv.config({ path: "../.env" });

const clientId = process.env.FB_CLIENT;
const clientSecret = process.env.FB_SECRET;
const ytClientId = process.env.YT_CLIENT;
const ytClientSecret = process.env.YT_SECRET;

const platforms: any = {
  facebook: { clientId, clientSecret, url: "https://graph.facebook.com/v19.0/oauth/access_token" },
  youtube: { clientId: ytClientId, clientSecret: ytClientSecret, url: "https://oauth2.googleapis.com/token" },
};
const getTokenUrl = (platform: string, token: string) => {
  const platformData = platforms[platform];
  if (!platformData) throw new Error("Platform not supported");
  
  if (platform === "facebook") {
    return `${platformData.url}?client_id=${platformData.clientId}&redirect_uri=${encodeURIComponent("http://localhost:5173/facebook/callback")}&client_secret=${platformData.clientSecret}&code=${token}`;
  }
  
  if (platform === "youtube") {
    return `${platformData.url}`;
  }

};

socialMediaRouter.post("/:platform/exchangecodefortoken", async (req: express.Request, res: express.Response) => {
  const { token } = req.body;
  const { platform } = req.params;
  const redirectUri = `http://localhost:5173/${platform}/callback`;

  if (!token) {
    sendResponse(res, 400, "Missing token");
    return;
  }

  try {
    const tokenUrl: any = getTokenUrl(platform, token);
    const response = await fetch(tokenUrl, {
      method: "POST",
      body: JSON.stringify({
        code: token,
        client_id: platforms[platform]?.clientId,
        client_secret: platforms[platform]?.clientSecret,
        redirect_uri: redirectUri,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    
    if (response.status === 400) {
      sendResponse(res, 400, data.error.message);
      return;
    }
    sendResponse(res, 200, "success", data);

  } catch (e) {
    sendResponse(res, 500, "Error while getting access token");
  }
});

