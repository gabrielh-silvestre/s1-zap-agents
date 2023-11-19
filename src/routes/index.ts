import { Client, Events } from 'whatsapp-web.js';

import { BaseHandler } from '../handlers';
import { RouteManager } from './manager';
import { RouteManagerFactoryOpt } from '../types/routes';

export function createRouterManager(
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
      console.log(`Handler ${handler.constructor.name} registered`);
    }

    console.log(`Route ${event} registered, total handlers: ${route.length}`);
  }

  console.log(`Total routes: ${hub.size}`);
  return new RouteManager(hub, client);
}
