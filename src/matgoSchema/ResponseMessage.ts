// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { MatgoCard } from './MatgoCard';
import { ResponseMessageCommand } from './MatgoType';

export interface ResponseMessage {
    sessionId: string;
    command: ResponseMessageCommand;
    value: number[];
    cards: MatgoCard[];
    putCards: MatgoCard[];
    takCards: MatgoCard[];
    playerFloorCards: MatgoCard[];
    message: string;
    nextPlayerId: string;
}
