import { z } from "zod";

export const collectionSchema = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    mediaName: z.string()
})