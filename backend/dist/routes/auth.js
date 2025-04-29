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
exports.auth = void 0;
const express_1 = require("express");
const authSchema_1 = require("../validator/authSchema");
const validator_1 = require("../middlewares/validator");
const prisma_1 = require("../prisma/prisma");
const helper_1 = require("../utils/helper");
exports.auth = (0, express_1.Router)();
//@ts-ignore
exports.auth.post("/signup", (0, validator_1.validator)(authSchema_1.signupSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.prisma.user.findUnique({
        where: { email: req.body.email }
    });
    if (isUserExist) {
        (0, helper_1.sendResponse)(res, 400, "User already exist");
        return;
    }
    try {
        const hashedPassed = yield (0, helper_1.hashPass)(req.body.password);
        const user = yield prisma_1.prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassed,
            }
        });
        if (!user) {
            (0, helper_1.sendResponse)(res, 400, "error while creating user");
            return;
        }
        //@ts-ignore
        const token = (0, helper_1.signToken)(user.email, user.id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });
        (0, helper_1.sendResponse)(res, 200, "User signed up success!");
    }
    catch (e) {
        console.log(e);
        (0, helper_1.sendResponse)(res, 500, "error while signup user");
    }
}));
//@ts-ignore
exports.auth.post("/login", (0, validator_1.validator)(authSchema_1.loginSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existUser = yield prisma_1.prisma.user.findUnique({
            where: { email: req.body.email }
        });
        if (!existUser) {
            (0, helper_1.sendResponse)(res, 400, "User not found!");
            return;
        }
        const isValidPassword = yield (0, helper_1.validPass)(req.body.password, existUser.password);
        if (!isValidPassword) {
            (0, helper_1.sendResponse)(res, 400, "Invalid Credentials");
            return;
        }
        const token = (0, helper_1.signToken)(existUser.email, existUser.id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });
        (0, helper_1.sendResponse)(res, 200, "User Authorized!");
    }
    catch (e) {
        console.log(e);
        (0, helper_1.sendResponse)(res, 500, "Error while login");
        ``;
    }
}));
