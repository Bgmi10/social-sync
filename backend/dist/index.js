"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config({ path: ".env" });
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use("/api/v1/auth", auth_1.auth);
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
