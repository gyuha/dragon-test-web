// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { RequestMessageCommand } from './RequestMessageCommand';
import { ResponseMessageCommand } from './ResponseMessageCommand';

export interface HoldemResult {
  sessionId: string;
  isDie: boolean;
  position: number;
  score: number;
  award: number;
}


export interface ResponseMessage {
  sessionId?: string; //! 클라이언트 아이디, 비어 있으면 공통
  command?: ResponseMessageCommand;
  playCommand?: RequestMessageCommand;
  value?: number[]; //! 값일 경우, [ 카드 패 결과, 카드 점수 ]
  message?: string; //! 메시지
  results?: HoldemResult[];
  cards?: string[];
}
