const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Get Gemini API key from .env
const geminiKey = process.env.GEMINI_KEY;

// Initialize AI
const genAI = new GoogleGenerativeAI(geminiKey);

// Create chat instance globally or in the function
let chat;

async function initChat() {
  if (!chat) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or gemini-1.5-pro
    chat = await model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a interviewer, who is really calm and please interview me" }],
        },
        {
          role: "model",
          parts: [
            {
              text:
                "Thank you for being here today — I really appreciate you taking the time.Let’s start simple.Can you please tell me a bit about yourself and what motivated you to apply for this role?Feel free to include anything from your background, studies, or personal interests that you feel is relevant. Take your time — I’m listening.",
            },
          ],
        },
      ],
    });
  }
}

// Function to generate response
exports.response = async (prompt) => {
  try {
    await initChat(); // Ensure chat is initialized
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    console.log(responseText);
    return responseText;
  } catch (error) {
    console.error("Error in AI response:", error.message);
    throw error;
  }
};
