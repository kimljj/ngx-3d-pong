import Coordinate from '../../../shared/classes/Coordinate';
import { PlayerPosition } from '../../../shared/enums/PlayerPosition';
import { DecodedGameState, GameState } from '../../../shared/interfaces/State';
import { WebsocketEvents } from '../../../shared/enums/WebsocketEvents';

export default class Player {
  private position: PlayerPosition;
  public coordinate: Coordinate;
  public userId: string;
  public socketInstance: any;

  constructor(position, coordinate) {
    this.position = position;
    this.coordinate = coordinate;
  }

  public sendGameState(state: GameState) {
    if (this.socketInstance) {
      this.socketInstance.emit(WebsocketEvents.GAME_STATE, this.decodeGameState(state));
    }
  }

  private decodeGameState(gameState: GameState): DecodedGameState {
    return {
      players: gameState.players.map((player: Player) => {
        return {
          userId: player.userId,
          position: player.position,
          coordinate: player.coordinate
        };
      }),
      ball: gameState.ball
    };
  }
}

