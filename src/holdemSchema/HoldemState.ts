// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { Player } from "./Player"
import { HoldemCard } from "./HoldemCard"
import { Board } from "./Board"

export class HoldemState extends Schema {
    @type("string") public roomState: string;
    @type("number") public holdemTurnState: number;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type([ HoldemCard ]) public boardCards: ArraySchema<HoldemCard> = new ArraySchema<HoldemCard>();
    @type(Board) public board: Board = new Board();
}
