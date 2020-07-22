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
  SMALL_BLINDER,
  BIG_BLINDER,
  PLAYER,
}
