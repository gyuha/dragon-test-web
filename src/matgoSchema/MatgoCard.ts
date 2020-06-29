//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 0.5.39
//

import { Schema, type } from "@colyseus/schema";

export class MatgoCard extends Schema {
  @type("number") public id: number;
  @type("number") public num: number;
  @type("number") public type: number;
  @type("number") public tag: number;
  @type("number") public image: number;
  @type("number") public event: number;
}
