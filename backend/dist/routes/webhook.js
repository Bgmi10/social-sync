"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhook = void 0;
const express_1 = require("express");
exports.webhook = (0, express_1.Router)();
const VERIFY_TOKEN = "ssssss";
exports.webhook.get("/webhook", (req, res) => {
    console.log("log");
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        }
        else {
            res.sendStatus(403);
        }
    }
});
