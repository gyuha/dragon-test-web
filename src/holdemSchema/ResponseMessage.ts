// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { ResponseMessageCommand } from './ResponseMessageCommand';

export interface ResponseMessage {
    sessionId: string;
    command: ResponseMessageCommand;
    value: number[];
    message: string;
    cards: string[];
    nextSessionId: string;
}
