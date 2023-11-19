import { createRouteManager } from './manager';

import {
  AudioHandler,
  CodeHandler,
  HelpHandler,
  SpeechHandler,
} from '../handlers';
import { RootHandler } from '../handlers/root';

export const router = createRouteManager(
  HelpHandler,
  AudioHandler,
  CodeHandler,
  SpeechHandler,
  RootHandler
);
