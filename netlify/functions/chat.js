const fetch = require("node-fetch");

exports.handler = async function(event) {
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const body = JSON.parse(event.body);
    const { messages } = body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages.slice(-7),
        temperature: 0.7,
        stream: true
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(line => line.trim().startsWith("data:

