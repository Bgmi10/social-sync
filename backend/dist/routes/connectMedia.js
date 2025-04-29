"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMedia = void 0;
const express_1 = require("express");
const validator_1 = require("../middlewares/validator");
const collectionSchema_1 = require("../validator/collectionSchema");
const prisma_1 = require("../prisma/prisma");
const helper_1 = require("../utils/helper");
exports.connectMedia = (0, express_1.Router)();
//@ts-ignore
exports.connectMedia.post("/connect-media", (0, validator_1.validator)(collectionSchema_1.collectionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const { id } = req.user;
    try {
        const response = yield prisma_1.prisma.connection.upsert({
            where: { userId_mediaName: {
                    mediaName: req.body.mediaName,
                    userId: id
                } },
            create: {
                accessToken: req.body.access_token,
                expiresIn: req.body.expires_in,
                mediaName: req.body.mediaName,
                userId: id
            },
            update: {
                accessToken: req.body.access_token,
                expiresIn: req.body.expires_in,
            }
        });
        (0, helper_1.sendResponse)(res, 200, "success");
    }
    catch (e) {
        console.log(e);
        (0, helper_1.sendResponse)(res, 500, "error while creating connection");
    }
}));
exports.connectMedia.delete("/connect-media", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        (0, helper_1.sendResponse)(res, 400, "Missing body");
        return;
    }
    try {
        const response = yield prisma_1.prisma.connection.delete({
            where: { id: parseInt(id) }
        });
        (0, helper_1.sendResponse)(res, 200, "success");
    }
    catch (e) {
        console.log(e);
        (0, helper_1.sendResponse)(res, 500, "error while deleting connections");
    }
}));
