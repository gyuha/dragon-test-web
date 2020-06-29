// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { RequestMessageType } from './MatgoType';

export interface RequestMessage {
    sessionId: string;
    type: RequestMessageType;
    value: number[];
}
