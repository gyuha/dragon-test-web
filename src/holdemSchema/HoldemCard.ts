// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";


export class HoldemCard extends Schema {
    @type("string") public id: string;
    @type("number") public rank: number;
    @type("number") public value: number;
    @type("string") public suit: string;
}
