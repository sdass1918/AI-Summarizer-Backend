import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey });

const systemPrompt = `You are an AI assistant that processes transcripts of conversations, lectures, or meetings. 
Your job is to carefully read the provided transcript and generate clear, accurate, and 
useful responses based on the user’s request.

Guidelines:
- Always stay faithful to the transcript content.
- If summarizing, make the output concise but informative.
- If asked for key points, extract them clearly and avoid filler words.
- If asked for insights, provide thoughtful analysis, but never invent facts.
- Maintain a professional, neutral, and helpful tone.
- If the transcript is unclear or incomplete, acknowledge the limitation.
`

export async function main(transcript: string, prompt: string) {
  const chatCompletion = await getGroqChatCompletion(transcript, prompt);
  return chatCompletion.choices[0]?.message?.content || "";
}

export async function getGroqChatCompletion(transcript: string, prompt: string) {
  return groq.chat.completions.create({
    messages: [
        {
            role: "system",
            content: systemPrompt
        },
        {
          role: "user",
          content: `Transcript:\n${transcript}\n\nUser Request:\n${prompt}`,
        }
      ],
    model: "openai/gpt-oss-20b",
  });
}
