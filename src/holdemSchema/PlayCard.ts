// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { MatgoCard } from "./MatgoCard"

export class PlayCard extends MatgoCard {
    @type("number") public from: number;
    @type("number") public to: number;
    @type("number") public action: number;
}
