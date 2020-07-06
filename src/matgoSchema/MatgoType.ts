export enum MessageType {
  "startGame" = 0,
  "firstPick" = 10,
  "play" = 20,
  "error" = 30
}

export enum RequestMessageCommand {
  "none" = 0,
  "put" = 10, //! 카드 내기
  "select" = 20, //! 선택하기
  "handCards" = 30, //! 손에 든 카드 확인
  "goStop" = 40, //! 고 or 스톱
  "gookjin" = 50, //! 국진
  "shake" = 60, //! 흔들기
  "startBonus" = 70 //! 보너스 카드 요청하기
}

export enum ResponseMessageCommand {
  "none" = 0,
  "take" = 10, //! 카드 받아가기
  "select" = 20, //! 카드 선택하기
  "handCards" = 30, //! 손에 있을 카드 조회
  "gostop" = 40, //! 스톱
  "gookjin" = 50, //! 국진
  "shake" = 60, //! 국진
  "startReady" = 70, //! 시작 대기 (보너스 카드 요청용)
  "error" = 100 //! 결과 종류
}
