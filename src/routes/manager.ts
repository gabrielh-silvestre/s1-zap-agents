import { Events, Client } from 'whatsapp-web.js';
import { BaseHandler } from '../handlers/base';

export class RouteManager {
  hub: Map<Events, Set<BaseHandler>>;

  client: Client;

  constructor(hub: Map<Events, Set<BaseHandler>>, client: Client) {
    this.hub = hub;
    this.client = client;

    this.hub.forEach((handlers, event) => {
      client.on(event, async (msg) => {
        for (const handler of handlers) {
          const executed = await handler.execute(msg);
          if (executed) break;
        }
      });
    });
  }
}
