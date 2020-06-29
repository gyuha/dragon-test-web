import { MatgoCard } from './Packet';
import { PlayerInfo } from './PlayerInfo';
import { PlayerStatus } from './PlayerStatus';

export interface Player {
  sessoinId: string;  //! 접속 아이디
  handCardCount: number;  //! 손에 든 카드 수
  floorCards: MatgoCard[]; //! 유저의 바닥 패
  status: PlayerStatus; //! 유저 상태
  info: PlayerInfo; //! 유저 정보
  trun: boolean;  //! 턴
  connected: boolean; //! 접속 상태
  exitReserve: boolean; //! 나가기 예약
}
