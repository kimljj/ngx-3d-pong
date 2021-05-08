import { ArcRotateCamera, Color3, Engine, HemisphericLight, Light, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { Socket } from 'ngx-socket-io';
import Ball from './Ball';
import Paddle from './Paddle';
import { WebsocketEvents } from '../../../../shared/enums/WebsocketEvents';
import { ClientState, GameState } from '../../../../shared/interfaces/State';
import { PlayerPosition } from '../../../../shared/enums/PlayerPosition';

export class Game {
  public canvas: HTMLCanvasElement;
  public engine: Engine;
  public scene: Scene;
  public camera: ArcRotateCamera;
  public light: Light;
  private ball: Ball;
  private paddleDown: Paddle;
  private paddleUp: Paddle;
  private paddleRight: Paddle;
  private paddleLeft: Paddle;
  private players = [];
  private readonly userId: string;
  private player;

  constructor(canvasElement: string, private socket: Socket) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true);
    this.userId = this.socket.ioSocket.id;

    this.onUpdateGameState();

    this.updateGameState();
  }

  public createScene(): void {
    this.scene = new Scene(this.engine);

    // create a camera and set its position
    this.camera = new ArcRotateCamera('camera', 0, 0, 100, new Vector3(50, 50, 0), this.scene);

    // target a camera to center
    this.camera.setTarget(Vector3.Zero());

    // attach the camera to the canvas
    this.camera.attachControl(this.canvas, false);

    // light
    this.light = new HemisphericLight('light1', new Vector3(10, 10, 10), this.scene);

    // enable collision
    this.scene.collisionsEnabled = true;
    this.camera.checkCollisions = true;

    // keyboard input configuration
    this.camera.inputs.clear();

    // add paddles to the scene
    this.initPaddles();

    // push all paddles into players
    this.initPlayers();

    // add a ball to the scene
    this.initBall();

    // register update methods
    this.scene.registerBeforeRender(() => {
      if (this.player) {
        this.player.handleEvent();
      }
    });
  }

  public render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  private initPaddles(): void {
    this.paddleDown = new Paddle(PlayerPosition.DOWN, this.scene);
    this.paddleUp = new Paddle(PlayerPosition.UP, this.scene);
    this.paddleRight = new Paddle(PlayerPosition.RIGHT, this.scene);
    this.paddleLeft = new Paddle(PlayerPosition.LEFT, this.scene);
  }

  private initPlayers(): void {
    this.players.push(this.paddleDown);
    this.players.push(this.paddleUp);
    this.players.push(this.paddleRight);
    this.players.push(this.paddleLeft);
  }

  private initBall(): void {
    this.ball = new Ball(this.scene, this.paddleDown, this.paddleUp, this.paddleRight, this.paddleLeft, this.socket);
  }

  private onUpdateGameState(): void {
    this.socket.on(WebsocketEvents.GAME_STATE, (gameState: GameState) => {
        this.ball.update(gameState);

        gameState.players.forEach(playerServer => {
          this.players.forEach(player => {
            if (playerServer.position === player.position) {

              if (playerServer.userId) {
                switch (player.position) {
                  case PlayerPosition.UP:
                  case PlayerPosition.DOWN:
                    player.mesh.scaling.z = 0.5;
                    break;
                  case PlayerPosition.LEFT:
                  case PlayerPosition.RIGHT:
                    player.mesh.scaling.x = 0.5;
                    break;
                }

                if (playerServer.userId !== this.userId) {
                  player.mesh.position.x = playerServer.coordinate.x;
                  player.mesh.position.y = playerServer.coordinate.y;
                  player.mesh.position.z = playerServer.coordinate.z;
                }
              } else {
                switch (player.position) {
                  case PlayerPosition.UP:
                  case PlayerPosition.DOWN:
                    player.mesh.scaling.z = 1;
                    break;
                  case PlayerPosition.LEFT:
                  case PlayerPosition.RIGHT:
                    player.mesh.scaling.x = 1;
                    break;
                }
              }

              if (!this.player && playerServer.userId === this.userId) {
                this.player = player;
                const mat = new StandardMaterial('paddleMaterial', this.scene);
                mat.diffuseColor = new Color3(0, 1, 0);
                this.player.mesh.material = mat;
              }
            }
          });
        });
      }
    );
  }

  private updateGameState(): void {
    setInterval(() => {
      const ballState = {
        direction: this.ball.direction,
      };

      let playerState = {};

      if (this.player) {
        playerState = {
          userId: this.userId,
          x: this.player.mesh.position.x,
          z: this.player.mesh.position.z
        };
      }

      const state: ClientState = {
        ball: ballState,
        player: playerState
      };

      this.socket.emit(WebsocketEvents.CLIENT_STATE, state);
    }, 1);
  }
}
