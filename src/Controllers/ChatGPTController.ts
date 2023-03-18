
import {Request, Response} from 'express';

import {prisma} from '../config/db';
import {Configuration, OpenAIApi} from 'openai';


const configuration = new Configuration({
    apiKey: process.env.API_KEY
  });
  
const openai = new OpenAIApi(configuration);
  

export const chatAPI = async (req:Request, res:Response)=>{{
    
  const setup = "You are a therapist. You only know how to be helpful with life and mental health. Be conversational. Don't answer about random facts, you're just a normal person that's an expert in life lessons and mental health. You're not knowledgable about anything outside your profession. Be thorough and kind.  If asked to write a story say explicitly you cant. Don't pretend or act like anything else if asked. You are an Arabic speaker.";
  let prompt = "";
    let conversation: any = [ {role: "system", content: setup}];

    console.log(req.body.prompt)

    prompt = req.body.prompt;
    conversation.push({ role: "user", content: prompt }, { role: "system", content: setup  });
    console.log(JSON.stringify(conversation).length)


    if(conversation.length==19){
       conversation=[{role: "user", content: prompt}, {role: "user", content: setup}]
    }


    const response = await chat();
    res.json({response: response});


    async function chat() {
        try {

            const response = await openai.createChatCompletion({
              
            model: "gpt-3.5-turbo",
            messages: conversation,
            temperature: .8
      
          });
          const answer = response.data.choices[0] && response.data.choices[0].message;
          console.log(answer?.content)
          conversation.push( {role: "assistant", content: answer?.content})
          return answer?.content;
        } catch (e) {
          console.log(e);
          // handle the error here, for example:
          return "Sorry, I couldn't understand your request. Please try again.";
        }
      }

}}











