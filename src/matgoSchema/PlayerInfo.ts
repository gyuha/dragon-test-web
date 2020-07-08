import { Schema, type } from "@colyseus/schema";

export class PlayerInfo extends Schema {
  @type("string") public name: string;
  @type("number") public money: number;
}
