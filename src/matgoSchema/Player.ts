import { ArraySchema, Schema, type } from '@colyseus/schema';
import { MatgoCard } from './MatgoCard';
import { PlayerInfo } from './PlayerInfo';

export class Player extends Schema {
  @type('string') public sessionId: string;
  @type('number') public handCardCount: number;
  @type([MatgoCard]) public floorCards: ArraySchema<MatgoCard> = new ArraySchema<MatgoCard>();
  @type(PlayerInfo) public info: PlayerInfo = new PlayerInfo();
  @type('boolean') public turn: boolean;
  @type('boolean') public connected: boolean;
  @type('boolean') public exitReserve: boolean;
}
