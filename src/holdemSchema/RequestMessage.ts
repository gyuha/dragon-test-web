// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { RequestMessageCommand } from './RequestMessageCommand';

export interface RequestMessage {
    sessionId: string;
    command: RequestMessageCommand;
    value: number[];
}
