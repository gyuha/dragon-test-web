// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { MatgoCard } from './MatgoCard';
import { ResponseMessageCommand, TurnCommand } from './MatgoType';
import { PlayCard } from './PlayCard';

export interface MatgoResult {
  sessionId: string; //! 이긴 사용자
  score: number; //! 점수
  amount: number; //! 상금
}

export interface ResponseMessage {
  sessionId?: string; //! 클라이언트 아이디, 비어 있으면 공통
  command?: ResponseMessageCommand;
  value?: number[]; //! 값일 경우
  cards?: MatgoCard[]; //! 카드 들
  playCards?: PlayCard[]; //! 게임 진행한 카드
  putCards?: MatgoCard[]; //! 낸 카드
  playerFloorCards?: MatgoCard[]; //! 플레이어의 바닥 카드
  message?: string; //! 메시지
  result?: MatgoResult,
  turn?: TurnCommand; //! 다음 턴 사용자 아이디
}
