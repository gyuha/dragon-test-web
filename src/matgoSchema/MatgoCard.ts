import { Schema, type } from "@colyseus/schema";

export enum CardType {
  BACK = -1,
  KWANG = 0, //! 0.광
  YEOL, //! 1.열
  TEE, //! 2.띠
  PEE, //! 3.피
  BOMB //! 4.폭탄
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
  BONUS //! 8.보너스
}

export class MatgoCard extends Schema {
  @type("number") public id: number;
  @type("number") public num: number;
  @type("number") public cardType: number;
  @type("number") public tag: number;
  @type("string") public image: string;
  @type("number") public group: number;
}
