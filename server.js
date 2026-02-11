import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

app.post("/api/chat", async (req, res) => {
try {

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:

`You are Ornum IT Solutions AI assistant.
You help diagnose computer problems and give repair estimates in South African Rand.

Rules:
• Be short and professional
• Ask troubleshooting questions
• If confident, provide a QUOTE
• Always include the word "QUOTE" when pricing
• Suggest WhatsApp booking after quoting`
},
...req.body.messages
]
})
});

const data = await response.json();
const reply = data.choices?.[0]?.message?.content || "No response";

res.json({ reply });

} catch (err) {
res.status(500).json({ reply: "AI server error" });
}
});

app.listen(3000, () => console.log("AI running"));