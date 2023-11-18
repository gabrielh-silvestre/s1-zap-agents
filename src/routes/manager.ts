import { Message } from 'whatsapp-web.js';
import { RouteBase } from './base';

export class RouteManager {
  routes: RouteBase[];

  constructor(...routes: RouteBase[]) {
    this.routes = routes;
  }

  async message(messsage: Message) {
    for (const route of this.routes) {
      const executed = await route.execute(messsage);
      if (executed) break;
    }
  }
}
