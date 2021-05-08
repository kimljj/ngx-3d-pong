import http from 'http';
import socketio from 'socket.io';
import { Game } from './classes/Game';
import { Logger } from '../../shared/classes/Logger';
import { gameSpeed, port } from '../../shared/constants/config';
import { WebsocketEvents } from '../../shared/enums/WebsocketEvents';
import { ClientState } from '../../shared/interfaces/State';

export class SocketServer {
  private io: socketio.Server;
  private game: Game;

  constructor(
    private readonly httpServer: http.Server
  ) {
    this.io = require('socket.io')(this.httpServer, {
      cors: {
        origin: '*'
      }
    });

    this.game = new Game();

    this.listenStatic();

    this.listenWebsocket();

    setInterval(() => this.updateGame(), gameSpeed);

    Logger.log(
      `Server is running at https://localhost:${port}`
    );
  }

  private updateGame(): void {
    this.game.update();
  }

  private listenStatic(): void {
    this.httpServer.listen(port);
  }

  private listenWebsocket(): void {
    this.io.on(WebsocketEvents.CONNECTION, (socket) => {

      this.game.addPlayer(socket);

      socket.on(WebsocketEvents.CLIENT_STATE, (clientState: ClientState) => {
          this.game.state.ball.direction = clientState.ball.direction;

          this.game.state.players.forEach(player => {
            if (player.userId === clientState.player.userId) {
              player.coordinate.x = clientState.player.x;
              player.coordinate.z = clientState.player.z;
            }
          });
        }
      );

      socket.on(WebsocketEvents.DISCONNECT, () => {
        this.game.removePlayer(socket.id);

        Logger.userLog(socket.id.toString(), 'disconnected');
      });
    });
  }
}
