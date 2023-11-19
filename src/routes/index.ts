import { Client, Events } from 'whatsapp-web.js';

import { BaseHandler } from '../handlers';
import { RouteManagerFactoryOpt } from '../types';
import { RouteManager } from './manager';

export function routerManagerFactory(
  client: Client,
  opts: RouteManagerFactoryOpt[]
) {
  const hub = new Map<Events, Set<BaseHandler>>();

  for (const opt of opts) {
    const { handlers, event } = opt;
    const route = handlers.map(({ handler, opts }) => new handler(opts));

    if (!hub.has(event)) hub.set(event, new Set());

    for (const handler of route) {
      hub.get(event)?.add(handler);
    }
  }

  return new RouteManager(hub, client);
}
