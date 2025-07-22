const { Configuration, OpenAIApi } = require('openai');

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    if (!userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Manjka vsebina sporočila.' })
      };
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response?.data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.log('⚠️ Ni odgovora:', response?.data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Prazen odgovor iz OpenAI.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error('💥 Napaka v funkciji:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
