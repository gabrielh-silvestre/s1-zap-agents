# cheap-gpt

## Docker

```bash
docker build --build-arg OPENAI_API_KEY=$OPENAI_API_KEY \
             --build-arg OPENAI_RAW_AGENT=<your_agent_id> \
             --build-arg OPENAI_CODE_AGENT=<your_agent_id> \
             --build-arg OPENAI_AUDIO_AGENT=<your_agent_id> \
             -t cheap-gpt:latest .
```
