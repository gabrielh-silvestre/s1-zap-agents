FROM oven/bun:debian

WORKDIR /app

COPY package.json .
COPY bun.lockb .

ARG OPENAI_API_KEY
ARG AGENT_ID

ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV AGENT_ID=$AGENT_ID
ENV CHROME_BIN=$CHROME_BIN

RUN bun install

COPY . .

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser ./node_modules \
    && chown -R pptruser:pptruser ./package.json \
    && chown -R pptruser:pptruser ./bun.lockb \
    && chown -R pptruser:pptruser ./.wwebjs_cache \
    && chown -R pptruser:pptruser ./.wwebjs_auth

USER pptruser

CMD ["bun", "run", "src/bin.ts"]
