"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const helper_1 = require("../utils/helper");
function authMiddleware(req, res, next) {
    const cookie = req.cookies;
    const token = cookie.token;
    if (!token) {
        (0, helper_1.sendResponse)(res, 400, "Unauthorized");
        return;
    }
    const isValidToken = (0, helper_1.verifyToken)(token);
    if (!isValidToken) {
        (0, helper_1.sendResponse)(res, 400, "token invalid");
        return;
    }
    console.log(isValidToken);
    //@ts-ignore
    req.user = isValidToken;
    next();
}
