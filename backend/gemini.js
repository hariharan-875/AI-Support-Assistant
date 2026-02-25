require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateReply(message, docs) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
  });

  const prompt = `
You are a product support assistant.

Answer ONLY using this documentation:

${docs || "No documentation available."}

If answer not found, respond exactly:
"Sorry, I don't have information about that."

User Question:
${message}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { generateReply };