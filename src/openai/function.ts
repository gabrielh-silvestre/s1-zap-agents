export abstract class AgentFunction {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  abstract execute(args: object[]): Promise<any>;
}
