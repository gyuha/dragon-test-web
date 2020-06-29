// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { MatgoCard } from "./MatgoCard";
import { Player } from "./Player";

export class MatgoState extends Schema {
    @type("string") public state: string;
    @type("string") public turn: string;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type([ MatgoCard ]) public floorCards: ArraySchema<MatgoCard> = new ArraySchema<MatgoCard>();
    @type("number") public backCardCount: number;
}
