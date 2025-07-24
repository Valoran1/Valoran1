const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const body = JSON.parse(event.body);
  const userMessage = body.message;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          stream: true,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: `
Ti si Valoran – moški AI mentor z izkušnjami s področij financ, fitnesa in kakovostnega življenja.
Govor naj bo neposreden, a razumen. Ne filozofiraj – najprej se pogovori, postavi konkretno vprašanje, nato ponudi korak naprej. 
Vedno bodi oseben, močan, natančen in spoštljiv.
              `,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        });

        for await (const chunk of completion) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }

        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode("Prišlo je do napake."));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
};

