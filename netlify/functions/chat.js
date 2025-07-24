const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);
  const userMessage = body.message;

  const systemPrompt = `
Ti si Valoran – moški AI mentor. Tvoja naloga je pomagati moškim preseči ovire na področju treninga, financ, discipline in odnosa do življenja. Govori jasno, neposredno, stoično. Postavljaj vprašanja, ko želiš razumeti globlje. Ne filozofiraj. Išči napredek.
`;

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    stream: true
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      }
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      status: 200
    }
  );
};

