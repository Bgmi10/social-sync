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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helper_1 = require("../../utils/helper");
const dotenv_1 = __importDefault(require("dotenv"));
const yt = (0, express_1.Router)();
dotenv_1.default.config({ path: "../.env" });
const clientId = process.env.YT_CLIENT;
const clientSecret = process.env.YT_SECRET;
yt.post("/exchangecodefortoken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const redirectUri = `http://localhost:5173/youtube/callback`;
    if (!token) {
        (0, helper_1.sendResponse)(res, 400, "Missing token");
        return;
    }
    try {
        const tokenUrl = `https://oauth2.googleapis.com/token?client_id=${clientId}&client_secret=${clientSecret}&code=${token}&redirect_uri=${encodeURIComponent(redirectUri)}&grant_type=authorization_code`;
        const response = yield fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const data = yield response.json();
        if (!response.ok) {
            (0, helper_1.sendResponse)(res, response.status, data.error_description || data.error);
            return;
        }
        (0, helper_1.sendResponse)(res, 200, "success", data);
    }
    catch (e) {
        console.log(e);
        (0, helper_1.sendResponse)(res, 500, "Error while getting access token");
    }
}));
exports.default = yt;
