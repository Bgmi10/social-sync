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
exports.fb = void 0;
const express_1 = require("express");
const helper_1 = require("../../utils/helper");
const dotenv_1 = __importDefault(require("dotenv"));
exports.fb = (0, express_1.Router)();
dotenv_1.default.config({ path: "../.env" });
const clientId = process.env.FB_CLIENT;
const clientSecret = process.env.FB_SECRET;
exports.fb.post("/exchangecodefortoken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body; // Keep it secret, backend ideally!
    const redirectUri = `http://localhost:5173/facebook/callback`;
    if (!token) {
        (0, helper_1.sendResponse)(res, 400, "Missing token");
        return;
    }
    try {
        const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${token}`;
        const response = yield fetch(tokenUrl);
        const data = yield response.json();
        if (response.status === 400) {
            (0, helper_1.sendResponse)(res, 400, data.error.message);
            return;
        }
        (0, helper_1.sendResponse)(res, 200, "success", data);
    }
    catch (e) {
        (0, helper_1.sendResponse)(res, 500, "error while getting accesstoken");
    }
}));
