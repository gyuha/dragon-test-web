// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

export interface ResponseMessage {
    sessionId: string;
    command: ResponseMessageCommand;
    value: number[];
    message: string;
    cards: HoldemCard[];
    nextSessionId: string;
}
