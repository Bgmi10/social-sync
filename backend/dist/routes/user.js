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
exports.user = void 0;
const express_1 = require("express");
const prisma_1 = require("../prisma/prisma");
const helper_1 = require("../utils/helper");
exports.user = (0, express_1.Router)();
exports.user.get("/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const { id } = req.user;
    try {
        const response = yield prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                email: true,
                name: true,
                connections: true
            }
        }); // Add type assertion to any
        (0, helper_1.sendResponse)(res, 200, "success", { user: response });
    }
    catch (e) {
        console.log(e);
        (0, helper_1.sendResponse)(res, 500, "error while getting profile");
    }
}));
