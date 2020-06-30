export enum MessageType {
  'startGame' = 0,
  'firstPick' = 10,
  'play' = 20,
}

export enum RequestMessageCommand {
  'none' = 0,
  'put' = 10, //! 카드 내기
  'backTake' = 10, //! 바닥 카드 뒤지기
  'goStop' = 20, //! 고 or 스톱
  'gookjin' = 30, //! 국진
  'shake' = 40, //! 흔들기
  'handCards' = 50, //! 손에 든 카드 확인
}

export enum ResponseMessageCommand {
  'none' = 0,
  'take' = 10, //! 카드 받아가기
  'backTake' = 20, //! 카드
  'selectCard' = 30, //! 카드 선택하기
  'handCards' = 40, //! 손에 있을 카드 조회
  'ppuk' = 50, //! 뻑
  'gostop' = 60, //! 스톱
  'kookjin' = 70, //! 국진
  'error' = 100, //! 결과 종류
}
