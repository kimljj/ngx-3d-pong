import { Logger } from '../../../shared/classes/Logger';
import { GameState } from '../../../shared/interfaces/State';
import { PlayerPosition } from '../../../shared/enums/PlayerPosition';
import { BallDirection } from '../../../shared/enums/BallDirection';
import Player from './Player';
import Ball from './Ball';
import Coordinate from '../../../shared/classes/Coordinate';

export class Game {
  public state: GameState;
  public ball: Ball;

  constructor() {
    this.ball = new Ball(BallDirection.DOWN);

    this.initState();

    this.initPlayers();
  }

  public addPlayer(socket) {
    const filtered = this.state.players.filter(player => !player.userId);

    if (filtered && filtered.length) {
      const freePosition = filtered[0];
      freePosition.userId = socket.id;
      freePosition.socketInstance = socket;
    }
  }

  public get players(): Player[] {
    return this.state.players;
  }

  public removePlayer(id: string) {
    this.state.players.filter(player => {
      if (id === player.userId) {
        player.userId = null;
        player.socketInstance = null;
      }
    });
    Logger.userLog(id, 'left game');
  }

  public update() {
    const hasPlayer = this.state.players.some(player => player.userId);

    if (hasPlayer) {
      this.ball.move();
    }

    this.state.players.forEach((player: Player) => {
      if (player.userId) {
        player.sendGameState(this.state);
      }
    });
  }

  private initState(): void {
    this.state = {
      players: [],
      ball: this.ball
    };
  }

  private initPlayers(): void {
    const playerUp = new Player(PlayerPosition.UP, new Coordinate(-50, 0, 0));
    const playerDown = new Player(PlayerPosition.DOWN, new Coordinate(50, 0, 0));
    const playerLeft = new Player(PlayerPosition.LEFT, new Coordinate(0, 0, -50));
    const playerRight = new Player(PlayerPosition.RIGHT, new Coordinate(0, 0, 50));

    this.state.players.push(playerDown);
    this.state.players.push(playerUp);
    this.state.players.push(playerLeft);
    this.state.players.push(playerRight);
  }
}
