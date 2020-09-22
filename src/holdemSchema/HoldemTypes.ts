export type PokerSuit = 'C' | 'D' | 'H' | 'S';

export enum CardRank {
  J = 11,
  Q = 12,
  K = 13,
  A = 14,
}

export enum HoldemCardsRank {
  HighCard = 0, //! 0. 하이카드
  OnePair, //! 1. 원페어
  TwoPair, //! 2. 투페어
  ThreeOfAKind, //! 3. 쓰리오브어 카인드
  Straight, //! 4. 스트레이트
  Flush, //! 5. 플러쉬
  FullHouse, //! 6. 풀하우스
  FourOfAKind, //! 7. 포 오브 어 카인드
  StraightFlush, //! 8. 스트레이트 플러쉬
  RoyalFlush, //! 9. 로얄 플러쉬
}

export interface IHoldemCard {
  id: string;
  rank: number;
  value: string;
  suit: PokerSuit;
}

export enum HoldemBetType {
  NONE,
  FOLD,
  CALL,
  BET,
  RAISE,
  CHECK,
  ALLIN,
}

export enum HoldemTurnState {
  READY, //! 0. 대기
  PRE_FLOP_DEAL_CARDS, //! 1. 프리플롭 카드 돌리기
  PRE_FLOP_BET, //! 2. 프리플롭 카드 배팅
  FLOP_CARD_OPEN, //! 3. 플롭 카드 열기
  FLOP_BET, //! 4. 플롭 배팅
  TURN_CARD_OPEN, //! 5. 턴 카드
  TURN_BET, //! 6. 턴 배팅
  RIVER_CARD_OPEN, //! 7. 리버 카드 열기
  RIVER_BET, //! 8. 리버 베팅
  FINISHED, //! 9. 완료
}

export enum PositionState {
  READY = 0,
  DEALER,
  SMALL_BLINDER,
  BIG_BLINDER,
  PLAYER,
}

export enum BetButtons {
  DIE = 0, //! 0. 다이 : 새로 베팅하지 않고, 이번 판을 포기합니다.
  CHECK, //! 1. 체크 : 머니를 베팅하지 않고 다음 카드를 받습니다.(보스(SB)만 가능)
  BBING, //! 2. 삥 : 기본 판돈만 베팅합니다.(보스(SB)만 가능)
  CALL, //! 3. 콜 : 앞 사람의 베팅 금액과 동일한 베팅 금액을 겁니다.
  DDADANG, //! 4. 따당 : 앞사람이 베팅 한 금액의 2배를 베팅합니다.
  HALF, //! 5. 하프 : 전체 판돈의 절반, 즉 50% 금액을 베팅합니다.
  MAX, //! 6. 맥스(올인) : 자신의 베팅 한도내의 최대 베팅
}
