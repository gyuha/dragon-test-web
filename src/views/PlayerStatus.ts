
export interface PlayerStatus {
  canFinsh: boolean; //! 스탑을 할 수 있는지
  score: number; //! 점수
  maxScore: number; //! 이전 점수
  goCount: number; //! 고 횟수
  shake: number; //! 흔듬
  boomCount: number; //! 폭탄 횟수
  cheongDan: number; //! 청단
  choDan: number; //! 초단
  hongDan: number; //! 홍단
  godori: number; //! 고도리
  kwangBak: boolean; //! 광박
  peeBak: boolean; //! 피박
}
