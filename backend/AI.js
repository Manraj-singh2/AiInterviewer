const { GoogleGenerativeAI } = require("@google/generative-ai");

//require dotenv for using env file
require("dotenv").config();

//getting gemini key from .env
const geminiKey = process.env.GEMINI_KEY;

//setting up Ai 
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//function to generate text with ai by receiving a prompt as input  
exports.response = async (prompt) => {
    try {
      const result = await model.generateContent(prompt);
      
      console.log(result.response.text());
      return Promise.resolve(result.response.text());
    } catch (error) {
      console.error("Error in AI response:", error.message);
      return Promise.reject(error);
    }
  };

  