"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "Kalboonyanmarsoos@gmail.com",
        pass: "kmsawlnlqaeymazn"
    }
});
const options = {
    from: "Kalboonyanmarsoos@gmail.com",
    to: "Kalboonyanmarsoos@gmail.com",
    subject: "nodemailer test",
    text: "nodemailer test"
};
transporter.sendMail(options);
