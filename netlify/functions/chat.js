const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Napaka: API ključ ni nastavljen." })
    };
  }

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
        messages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "AI ni odgovoril. Poskusi ponovno." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };

  } catch (err) {
    console.error("API napaka:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Napaka: AI trenutno ni dosegljiv." })
    };
  }
};

