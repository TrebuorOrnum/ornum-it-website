const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/* Business brain (VERY IMPORTANT) */
const SYSTEM_PROMPT = `
You are the Ornum IT Solutions AI assistant.

Business info:
Company: Ornum IT Solutions
Location: South Africa
Services:
- Laptop repair
- Screen replacement
- Phone repair
- Windows installation
- Virus removal
- Network setup
- Data recovery

Rules:
1) Always help diagnose problems first.
2) Then give an estimated price in South African Rand (R).
3) Offer WhatsApp booking using this link:
https://wa.me/27671234567?text=Hello%20I%20want%20to%20book%20a%20repair

Price Guide:
Screen replacement: R900 – R2500
Windows install: R450
Virus removal: R350
SSD upgrade: R800 – R1800
Cleaning service: R250

Be friendly, short, and clear.
`;

app.post("/api/chat", async (req, res) => {
    try {
        const userMessages = req.body.messages || [];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...userMessages
                ]
            })
        });

        const data = await response.json();

        const reply = data.choices?.[0]?.message?.content || 
        "Sorry, I couldn't respond right now.";

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "AI server error." });
    }
});

app.listen(3000, () => {
    console.log("AI Server running on port 3000");
});
