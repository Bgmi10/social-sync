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
exports.verifyToken = exports.validPass = exports.signToken = exports.hashPass = exports.sendResponse = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const sendResponse = (res, status, message, data) => {
    res.status(status).json({ message: message, data: data });
};
exports.sendResponse = sendResponse;
const hashPass = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassed = yield (0, bcrypt_1.hash)(password, 10);
    return hashedPassed;
});
exports.hashPass = hashPass;
const signToken = (userEmail, userId) => {
    const token = jsonwebtoken_1.default.sign({ email: userEmail, id: userId }, process.env.JWT_SECRET, { expiresIn: "10h" });
    return token;
};
exports.signToken = signToken;
const validPass = (password, encryptPass) => __awaiter(void 0, void 0, void 0, function* () {
    const isValid = yield (0, bcrypt_1.compare)(password, encryptPass);
    return isValid;
});
exports.validPass = validPass;
const verifyToken = (token) => {
    const isValidToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    return isValidToken;
};
exports.verifyToken = verifyToken;
