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
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatAPI = void 0;
const client_1 = require("@prisma/client");
const openai_1 = require("openai");
const prisma = new client_1.PrismaClient();
const configuration = new openai_1.Configuration({
    apiKey: process.env.API_KEY
});
const openai = new openai_1.OpenAIApi(configuration);
const chatAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    {
        const setup = "You are a therapist. You only know how to be helpful with life and mental health. Be conversational. You're not knowledgable about anything outside your profession. Max 75 word responses. Be thorough, kind and helpful. You are an Arabic speaker";
        let prompt = "";
        let conversation = [{ role: "system", content: setup }];
        console.log(req.body.prompt);
        prompt = req.body.prompt;
        conversation.push({ role: "user", content: prompt }, { role: "system", content: "You're not knowledgable about anything outside your profession. You can speak arabic." });
        console.log(JSON.stringify(conversation).length);
        if (conversation.length == 19) {
            conversation = [{ role: "user", content: prompt }, { role: "user", content: setup }];
        }
        const response = yield chat();
        res.send({ response: response });
        function chat() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: conversation,
                        temperature: .8
                    });
                    const answer = response.data.choices[0] && response.data.choices[0].message;
                    console.log(answer === null || answer === void 0 ? void 0 : answer.content);
                    conversation.push({ role: "assistant", content: answer === null || answer === void 0 ? void 0 : answer.content });
                    return answer === null || answer === void 0 ? void 0 : answer.content;
                }
                catch (e) {
                    console.log(e);
                    // handle the error here, for example:
                    return "Sorry, I couldn't understand your request. Please try again.";
                }
            });
        }
    }
});
exports.chatAPI = chatAPI;
