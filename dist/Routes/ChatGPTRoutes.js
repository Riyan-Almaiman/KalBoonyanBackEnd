"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatGPTController_1 = require("../Controllers/ChatGPTController");
const router = express_1.default.Router();
router.post("/prompt", ChatGPTController_1.chatAPI);
exports.default = router;
