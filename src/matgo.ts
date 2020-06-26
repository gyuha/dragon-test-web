export enum CardType {
  BACK = -1,
  KWANG = 0, //! 0.광
  YEOL, //! 1.열
  TEE, //! 2.띠
  PEE, //! 3.피
  BONUS, //! 4.보너스
}

export enum CardTag {
  BACK = -1, //! -1.뒷면
  NONE = 0, //! 0.없음.
  GODORI, //! 1.고도리
  TWO_PEE, //! 2.쌍피
  CHEONG_DAN, //! 3.청단
  HONG_DAN, //! 4.홍단
  CHO_DAN, //! 5.초단
  KOOKJIN, //! 6.국진
  BEE_KWANG, //! 7. 비광
}

export enum CardEvent {
  NONE, //! 없음
  JJOK, //! 쪽
  PPUK, //! 뻑
  DDADAK, //! 따닥
  BOMB, //! 폭탄
  CLEAN, //! 싹쓸이
  EAT_PPUK, //! 뻑 먹음
  SELF_EAT_PPUK, //! 자뻑 먹음
  SHAKE, //! 흔들기
  TAKE_PEE, //! 상대편의 피를 가져 온다.
}

export interface Card {
  id: number;
  num: number;
  type: CardType;
  tag: CardTag;
  image: number;
  event: CardEvent;
}

export interface RequestMessage {
  sessionId?: string; //! 클라이언트 아이디, 비어 있으면 공통
  type?: 'put' | 'gostop' | 'gookjin' | 'shake' | 'backTake';
  value?: any; //! 임시 변수
  cards?: number[]; //! 선택한 카드의 순번
}


export interface ResponseMessage {
  sessionId?: string; //! 클라이언트 아이디, 비어 있으면 공통
  type?: 'take' | 'handCards' | 'backTake' | 'ppuk' | 'gostop' | 'kookjin' | 'error'; //! 결과 종류
  value?: any; //! 값일 경우
  putCards?: Card[]; //! 낸 카드
  cards?: Card[]; //! 가져간 카드 카드
  message?: string;
  nextPlayerId?: string; //! 다음 턴 사용자 아이디
}
