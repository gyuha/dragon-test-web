// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { Player } from "./Player"
import { MatgoCard } from "./MatgoCard"

export class MatgoState extends Schema {
    @type("string") public state: string;
    @type("string") public turn: string;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type([ MatgoCard ]) public floorCards: ArraySchema<MatgoCard> = new ArraySchema<MatgoCard>();
    @type("number") public backCardCount: number;
}
