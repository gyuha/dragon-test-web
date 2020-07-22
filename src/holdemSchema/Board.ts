// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { HoldemCard } from "./HoldemCard"

export class Board extends Schema {
    @type([ HoldemCard ]) public cards: ArraySchema<HoldemCard> = new ArraySchema<HoldemCard>();
}
