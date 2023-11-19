import { Message } from 'whatsapp-web.js';
import { BaseHandler } from '../handlers/base';

export class RouteManager {
  handlers: BaseHandler[];

  constructor(...handlers: BaseHandler[]) {
    this.handlers = handlers;
  }

  async message(messsage: Message) {
    for (const route of this.handlers) {
      const executed = await route.execute(messsage);

      if (executed) {
        console.log(route.name);
        break;
      }
    }
  }
}

export function createRouteManager(...handlers: (typeof BaseHandler)[]) {
  return new RouteManager(...handlers.map((handler: any) => new handler()));
}
