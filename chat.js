const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const apiKey = process.env.OPENAI_API_KEY;
  const body = JSON.parse(event.body);
  const { messages } = body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Napaka: AI ni dosegljiv." })
    };
  }
};