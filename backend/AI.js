const { GoogleGenerativeAI } = require("@google/generative-ai");
//require dotenv for using env file
require("dotenv").config();

const geminiKey = process.env.GEMENI_KEY;

const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.response = async (prompt) => {
    try {
      const result = await model.generateContent(prompt);
  
      return Promise.resolve(result.response.text());
    } catch (error) {
      console.error("Error in AI response:", error.message);
      return Promise.reject(error);
    }
  };
