import express from "express";
import dotenv from "dotenv";
import { auth } from "./routes/auth";
import bodyParser from "body-parser";
import cors from "cors";
import { user } from "./routes/user";
import { authMiddleware } from "./middlewares/authMiddleware";
import cookieParser from "cookie-parser";
import { webhook } from "./routes/webhook";
import { connectMedia } from "./routes/connectMedia";
import { socialMediaRouter } from "./routes/socialMediaRouter";
import { fb } from "./routes/exchangecodefortoken/fb";
import yt from "./routes/exchangecodefortoken/yt";

dotenv.config({ path: "../.env" });
const port = process.env.PORT;
const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json())

app.use("/api/v1/auth", auth);
app.use("/api/v1", authMiddleware, user);
app.use("/api/v1", webhook);
app.use("/api/v1/fb", authMiddleware, fb);
app.use("/api/v1/yt", authMiddleware, yt);
app.use("/api/v1", authMiddleware, connectMedia);

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});