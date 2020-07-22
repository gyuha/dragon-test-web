export enum ResponseMessageCommand {
  'none' = 0,
  'take' = 10, //! 카드 받아가기
  'play' = 20, //! 사용자 플레이
  'error' = 100,
}

export enum PlayerCommand {
  'fold' = 0,
  'call',
  'raise',
  'allIn',
}
