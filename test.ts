const { OpenAIApi, Configuration } = require('openai');
const readline = require('readline');

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: '',
  }),
);

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

userInterface.prompt();
userInterface.on('line', async (input) => {
  const response = await openAi.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: input }],
  });
  console.log(response.data.choices[0].message.content);
  userInterface.prompt();
});
