import Player from '../../server/src/classes/Player';
import Ball from '../../server/src/classes/Ball';

export interface ClientState {
  player: any;
  ball: any
}

export interface GameState {
  players: any;
  ball: Ball
}

export interface DecodedGameState {
  players: Player[];
  ball: Ball
}
