export enum RequestMessageCommand {
  'none' = 0,
  'bet' = 10, //! 카드 내기
  'fold' = 20, //! 선택하기
  'raise' = 30, //! 손에 든 카드 확인
  'allIn' = 40, //! 고 or 스톱
}
