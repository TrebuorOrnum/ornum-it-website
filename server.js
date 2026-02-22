import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

/* health check (VERY important for Render) */
app.get("/", (req,res)=>{
res.send("Ornum AI running");
});

/* chat endpoint */
app.post("/api/chat", async (req, res) => {

try {

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://ornum-it-website-aii.onrender.com",
    "X-Title": "Ornum IT Solutions AI"
  },
  body: JSON.stringify({
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are Ornum IT Solutions AI technician in South Africa.

Diagnose computer problems and estimate repair prices in South African Rand (R).

Typical pricing:
Virus removal: R350–R700
Windows reinstall: R650–R950
SSD upgrade: R900–R1500
RAM upgrade: R450–R900
Laptop overheating service: R450–R800

Rules:
• Be concise
• Ask 1–2 troubleshooting questions
• When confident, give a QUOTE
• ALWAYS include the word QUOTE
• Encourage WhatsApp booking after quoting`
      },
      ...req.body.messages
    ]
  })
});

const data = await response.json();

const reply = data.choices?.[0]?.message?.content || "No response from AI";

res.json({ reply });

} catch (err) {
console.log(err);
res.status(500).json({ reply: "AI temporarily unavailable" });
}

});

app.listen(3000, () => console.log("AI running"));