import { MatgoCard } from './MatgoCard';

export enum CardMove {
  NONE = 0, //! 없음
  PLAYER_HAND, //! 플레이어 손
  PLAYER_FLOOR, //! 플레이어 바닥
  FLOOR, //! 바닥
  BACK, //! 뒤집힌 카드
  OPPOSITE_HAND, //! 상대 손
  OPPOSITE_FLOOR, //! 상대 바닥
}

export enum CardAction {
  NONE = 0,
  MOVE, //! 이동
  TAKE, //! 받기
  PUT, //! 카드 내기
  JJOK, //! 쪽
  PPUK, //! 뻑
  DDADAK, //! 따딱
  BOMB, //! 폭탄
  CLEAN, //! 싹쓸이
  EAT_PPUK, //! 뻑 먹기
  SELF_EAT_PPUK, //! 자뻑 먹기
  SHAKE, //! 흔들기
  TAKE_PEE, //! 상대에게 받기
}

export class PlayCard extends MatgoCard {
  public selected: boolean = false; //! 선택 되어 있는지 체크, 선뽑기, 게임 진행 중 체크

  public from: CardMove | string = '';
  public to: CardMove | string = '';
  public action: CardAction = CardAction.NONE; //! 카드의 실행 액션

  constructor(card: MatgoCard, selected = false) {
    super(card);
  }
}
