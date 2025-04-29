import { Router } from "express";
import { prisma } from "../prisma/prisma";
import { sendResponse, ytRefreshToken } from "../utils/helper";

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
        });

        if (!response?.connections) {
            sendResponse(res, 200, "success", { user: response });
            return
        }

        const youtubeConnections = response.connections.filter(item => item.mediaName === "youtube");
        const youtubeConnection = youtubeConnections[0];

        if (youtubeConnection) {
            // Convert expiresIn to absolute timestamp if it's in seconds
            const expirationTime = youtubeConnection.expiresIn < Date.now() / 1000 
                ? Date.now() + (youtubeConnection.expiresIn * 1000)
                : youtubeConnection.expiresIn;

            // Check if token is expired or will expire in next 5 minutes
            const isExpired = Date.now() > expirationTime - (5 * 60 * 1000);

            if (isExpired && youtubeConnection.refreshToken) {
                try {
                    const data = await ytRefreshToken(youtubeConnection.refreshToken);
                    
                    if (data?.access_token) {
                        // Store absolute expiration time
                        const newExpiresIn = Date.now() + (data.expires_in * 1000);
                        
                        await prisma.connection.update({
                            where: { id: youtubeConnection.id },
                            data: {
                                accessToken: data.access_token,
                                expiresIn: newExpiresIn
                            }
                        });
                        
                        // Update the response object with new token
                        youtubeConnection.accessToken = data.access_token;
                        youtubeConnection.expiresIn = newExpiresIn;
                    }
                } catch (error) {
                    console.error("Failed to refresh YouTube token:", error);
                }
            }
        }
        sendResponse(res, 200, "success", { user: response });
    } catch (e) {
        console.log(e);
        sendResponse(res, 500, "error while getting profile");
    }
})