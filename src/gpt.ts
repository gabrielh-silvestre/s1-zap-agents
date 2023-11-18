import OpenAI from 'openai';

export const openai = new OpenAI();

export const chat = async (message: string) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: message },
    ],
  });

  console.log(completion.choices);

  return completion.choices[0].message;
};
