"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionSchema = void 0;
const zod_1 = require("zod");
exports.collectionSchema = zod_1.z.object({
    access_token: zod_1.z.string(),
    expires_in: zod_1.z.number(),
    mediaName: zod_1.z.string()
});
