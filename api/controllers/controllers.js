// const { Configuration, OpenAIApi } = require("openai");
const { apiLimiter } = require("../security/security");
const axios = require("axios");

// Handle GET /greeting route
async function handleGreeting(req, res) {
  res.send("Greetings, this is Flow Master Dashboard");
}

// Handle POST /chat route
async function handleChat(req, res) {
  const { message } = req.body;

  try {
    const response = await apiLimiter.post(
      `${process.env.OPEN_AI_POST_URL}`, //"https://api.openai.com/v1/chat/completions"

      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert assistant specialized in system software and systems programming. Your task is to provide translations of given RISC-V machine code into corresponding assembly code in little-endian format. The JSON should consist of an object containing an array called 'result', each with the following keys: id, assembly code, machine code, explaination, error. keep error object empty if there is no error; If there is error; suggest what was wrong in the error. Make sure the id is unique, somethig like time-data combo.",
          },
          {
            role: "user",
            content: `${message}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log(reply);
    res.json({ message: reply });
  } catch (error) {
    console.error("OpenAI API request failed:", error.message);
    res.status(500).json({ error: "Failed to process the request" });
  }
}

module.exports = { handleGreeting, handleChat };
