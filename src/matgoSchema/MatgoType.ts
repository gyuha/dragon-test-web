export enum MessageType {
  'startGame' = 0,
  'firstPick' = 10,
  'play' = 20,
  'end' = 30,
  'jackpot' = 40,
  'error' = 100,
}

export enum TurnCommand {
  'stay' = 0, //! 턴 진행 중
  'complete' = 1, //! 턴 완료
  'goOrStop' = 2, //! 고스톱
  'chongTong' = 3, //! 총통
  'lastTurnStop' = 4, //! 마지막 턴으로 게임 끝내기
}

export enum GoStopCommand {
  'stop' = 0,
  'go',
}

export enum RequestMessageCommand {
  'none' = 0,
  'put' = 10, //! 카드 내기
  'select' = 20, //! 선택하기
  'handCards' = 30, //! 손에 든 카드 확인
  'goStop' = 40, //! 고 or 스톱
  'kookjin' = 50, //! 국진
  'shake' = 60, //! 흔들기
  'startBonus' = 70, //! 시작 보너스 받기
  'turnEnd' = 80, //! 턴 끝내기
  'playStart' = 90, //! 다시 시작하기
  'playLeave' = 91, //! 게임 끝내기
}

export enum ResponseMessageCommand {
  'none' = 0,
  'take' = 10, //! 카드 받아가기
  'select' = 20, //! 카드 선택하기
  'handCards' = 30, //! 손에 있을 카드 조회
  'gostop' = 40, //! 스톱
  'kookjin' = 50, //! 국진
  'shake' = 60, //! 국진
  'startReady' = 70, //! 시작 완료
  'turnEnd' = 80, //! 턴 끝내기
  'end' = 90, //! 게임 결과
  'error' = 100, //! 결과 종류
}
