// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { MatgoCard } from "./MatgoCard"
import { PlayerStatus } from "./PlayerStatus"
import { PlayerInfo } from "./PlayerInfo"

export class Player extends Schema {
    @type("string") public sessionId: string;
    @type("number") public handCardCount: number;
    @type([ MatgoCard ]) public floorCards: ArraySchema<MatgoCard> = new ArraySchema<MatgoCard>();
    @type(PlayerStatus) public status: PlayerStatus = new PlayerStatus();
    @type(PlayerInfo) public info: PlayerInfo = new PlayerInfo();
    @type("boolean") public turn: boolean;
    @type("boolean") public connected: boolean;
    @type("boolean") public exitReserve: boolean;
}
