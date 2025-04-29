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
exports.socialMediaRouter = void 0;
const express_1 = require("express");
const helper_1 = require("../utils/helper");
const dotenv_1 = __importDefault(require("dotenv"));
exports.socialMediaRouter = (0, express_1.Router)();
dotenv_1.default.config({ path: "../.env" });
const clientId = process.env.FB_CLIENT;
const clientSecret = process.env.FB_SECRET;
const ytClientId = process.env.YT_CLIENT;
const ytClientSecret = process.env.YT_SECRET;
const platforms = {
    facebook: { clientId, clientSecret, url: "https://graph.facebook.com/v19.0/oauth/access_token" },
    youtube: { clientId: ytClientId, clientSecret: ytClientSecret, url: "https://oauth2.googleapis.com/token" },
};
const getTokenUrl = (platform, token) => {
    const platformData = platforms[platform];
    if (!platformData)
        throw new Error("Platform not supported");
    if (platform === "facebook") {
        return `${platformData.url}?client_id=${platformData.clientId}&redirect_uri=${encodeURIComponent("http://localhost:5173/facebook/callback")}&client_secret=${platformData.clientSecret}&code=${token}`;
    }
    if (platform === "youtube") {
        return `${platformData.url}`;
    }
};
exports.socialMediaRouter.post("/:platform/exchangecodefortoken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { token } = req.body;
    const { platform } = req.params;
    const redirectUri = `http://localhost:5173/${platform}/callback`;
    if (!token) {
        (0, helper_1.sendResponse)(res, 400, "Missing token");
        return;
    }
    try {
        const tokenUrl = getTokenUrl(platform, token);
        const response = yield fetch(tokenUrl, {
            method: "POST",
            body: JSON.stringify({
                code: token,
                client_id: (_a = platforms[platform]) === null || _a === void 0 ? void 0 : _a.clientId,
                client_secret: (_b = platforms[platform]) === null || _b === void 0 ? void 0 : _b.clientSecret,
                redirect_uri: redirectUri,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = yield response.json();
        if (response.status === 400) {
            (0, helper_1.sendResponse)(res, 400, data.error.message);
            return;
        }
        (0, helper_1.sendResponse)(res, 200, "success", data);
    }
    catch (e) {
        (0, helper_1.sendResponse)(res, 500, "Error while getting access token");
    }
}));
