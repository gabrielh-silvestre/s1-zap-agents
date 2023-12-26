import { Events, Client } from 'whatsapp-web.js';
import { BaseHandler } from '../handlers/base';

export class RouteManager {
  hub: Map<Events, Set<BaseHandler>>;

  client: Client;

  constructor(hub: Map<Events, Set<BaseHandler>>, client: Client) {
    this.hub = hub;
    this.client = client;

    for (const [event, handlers] of this.hub) {
      client.on(event, async (msg) => {
        for (const handler of handlers) {
          const shouldExecute = await handler.shouldExecute(msg);
          if (shouldExecute) {
            await handler.execute(msg);
            break;
          }
        }
      });
    }
  }
}
