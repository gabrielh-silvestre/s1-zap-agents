import OpenAI from 'openai';

const systemPromptFile = Bun.file(`${import.meta.dir}/prompts/system.txt`, {
  type: 'text/plain;charset=utf-8',
});
const systemPrompt = await systemPromptFile.text();

export const openai = new OpenAI();

export const chat = async (message: string) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
  });

  console.log(completion);

  return completion.choices[0].message;
};
