# cheap-gpt

## Docker

```bash
docker build --build-arg OPENAI_API_KEY=$OPENAI_API_KEY \
             --build-arg AGENT_ID=<your_agent_id> \
             -t cheap-gpt:latest .
```

```bash
docker run -it --rm cheap-gpt:latest
```

## Usage Example

```ts
export const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.CHROME_BIN,
    headless: true,
  },

  authStrategy: new LocalAuth(),
});

startAgent(client, {
  route: [
    {
      event: Events.MESSAGE_CREATE,
      handlers: [
        { handler: AudioHandler },
        {
          handler: SpeechHandler,
          opts: { command: '--to-audio', agent: new Agent(AgentEnum.audio) },
        },
        {
          handler: TracribeHandler,
          opts: { command: '--to-text', agent: new Agent(AgentEnum.audio) },
        },
        {
          handler: TextHandler,
          opts: { command: '/gpt', agent: new Agent(AgentEnum.raw) },
        },
      ],
    },
  ],
});
```
