// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { Player } from "./Player"
import { PlayerStatus } from "./PlayerStatus"
import { MatgoCard } from "./MatgoCard"

export class MatgoState extends Schema {
    @type("string") public state: string;
    @type("string") public turn: string;
    @type("number") public turnNumber: number;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type({ map: PlayerStatus }) public status: MapSchema<PlayerStatus> = new MapSchema<PlayerStatus>();
    @type([ MatgoCard ]) public floorCards: ArraySchema<MatgoCard> = new ArraySchema<MatgoCard>();
    @type("number") public backCardCount: number;
    @type("number") public nagari: number;
}
