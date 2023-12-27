import { ChatCompletionMessageParam } from 'openai/resources';
import { Message } from 'whatsapp-web.js';

import { GPT_MSG_REGEX } from './constants';

export const wppMsgToGpt = (msg: Message): ChatCompletionMessageParam => ({
  content: msg.body,
  role: GPT_MSG_REGEX(msg.body) ? 'assistant' : 'user',
});

export const isAudioMsg = (msg: Message): boolean => msg.hasMedia && msg.type === 'ptt';

export const isImageMsg = (msg: Message): boolean => msg.hasMedia && msg.type === 'image';
