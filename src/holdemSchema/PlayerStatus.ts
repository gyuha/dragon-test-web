// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";


export class PlayerStatus extends Schema {
    @type("boolean") public canFinish: boolean;
    @type("number") public score: number;
    @type("number") public goCount: number;
    @type("number") public shake: number;
    @type("number") public boomCount: number;
    @type("number") public cheongDan: number;
    @type("number") public choDan: number;
    @type("number") public hongDan: number;
    @type("number") public godori: number;
    @type("number") public kwang: number;
    @type("boolean") public kwangBak: boolean;
    @type("number") public pee: number;
    @type("boolean") public peeBak: boolean;
}
