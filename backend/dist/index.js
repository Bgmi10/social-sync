"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const webhook_1 = require("./routes/webhook");
const connectMedia_1 = require("./routes/connectMedia");
const fb_1 = require("./routes/exchangecodefortoken/fb");
const yt_1 = __importDefault(require("./routes/exchangecodefortoken/yt"));
dotenv_1.default.config({ path: "../.env" });
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use("/api/v1/auth", auth_1.auth);
app.use("/api/v1", authMiddleware_1.authMiddleware, user_1.user);
app.use("/api/v1", webhook_1.webhook);
app.use("/api/v1/fb", authMiddleware_1.authMiddleware, fb_1.fb);
app.use("/api/v1/fb", authMiddleware_1.authMiddleware, yt_1.default);
app.use("/api/v1", authMiddleware_1.authMiddleware, connectMedia_1.connectMedia);
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
