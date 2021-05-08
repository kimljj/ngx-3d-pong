import { Socket } from 'ngx-socket-io';
import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial } from '@babylonjs/core';
import { BallDirection, PaddleDirection } from '../../../../shared/enums/BallDirection';
import Paddle from './Paddle';
import { GameState } from '../../../../shared/interfaces/State';

export default class Ball {
  public mesh: Mesh;
  public direction: BallDirection;
  private paddleDown: Paddle;
  private paddleUp: Paddle;
  private paddleRight: Paddle;
  private paddleLeft: Paddle;

  constructor(scene: Scene,
              paddleDown: Paddle,
              paddleUp: Paddle = null,
              paddleRight: Paddle = null,
              paddleLeft: Paddle = null,
              private socket: Socket) {
    // create a ball
    this.mesh = MeshBuilder.CreateSphere('ball', {
      diameter: 6,
      updatable: true
    }, scene);

    // prepare the materialaå
    const mat = new StandardMaterial('ballMaterial', scene);
    mat.diffuseColor = new Color3(1, 0, 0);

    // add color to a ball
    this.mesh.material = mat;

    // set direction
    this.direction = BallDirection.DOWN;

    // enable collision
    this.mesh.checkCollisions = true;

    this.paddleDown = paddleDown;
    this.paddleUp = paddleUp;
    this.paddleRight = paddleRight;
    this.paddleLeft = paddleLeft;
  }

  public update(newState): GameState {
    this.move(newState.ball);

    this.checkCollision();

    newState.ball.direction = this.direction;

    return newState;
  }

  private move(newState): void {
    this.mesh.position.x = newState.coordinate.x;
    this.mesh.position.y = newState.coordinate.y;
    this.mesh.position.z = newState.coordinate.z;
    this.direction = newState.direction;
  }

  private checkCollision(): void {
    if (this.mesh.intersectsMesh(this.paddleDown.mesh, false)) {
      if (this.paddleDown.getDirection() === PaddleDirection.NONE) {
        this.direction = BallDirection.UP;
      } else if (this.paddleDown.getDirection() === PaddleDirection.LEFT) {
        this.direction = BallDirection.L_UP;
      } else if (this.paddleDown.getDirection() === PaddleDirection.RIGHT) {
        this.direction = BallDirection.R_UP;
      }
      return;
    }

    if (this.mesh.intersectsMesh(this.paddleUp.mesh, false)) {
      if (this.paddleUp.getDirection() === PaddleDirection.NONE) {
        this.direction = BallDirection.DOWN;
      } else if (this.paddleUp.getDirection() === PaddleDirection.LEFT) {
        this.direction = BallDirection.L_DOWN;
      } else if (this.paddleUp.getDirection() === PaddleDirection.RIGHT) {
        this.direction = BallDirection.R_DOWN;
      }
      return;
    }

    if (this.mesh.intersectsMesh(this.paddleRight.mesh, false)) {
      if (this.paddleRight.getDirection() === PaddleDirection.NONE) {
        this.direction = BallDirection.L_UP;
      } else if (this.paddleRight.getDirection() === PaddleDirection.UP) {
        this.direction = BallDirection.L_UP;
      } else if (this.paddleRight.getDirection() === PaddleDirection.DOWN) {
        this.direction = BallDirection.L_DOWN;
      }
      return;
    }

    if (this.mesh.intersectsMesh(this.paddleLeft.mesh, false)) {
      if (this.paddleLeft.getDirection() === PaddleDirection.NONE) {
        this.direction = BallDirection.R_UP;
      } else if (this.paddleLeft.getDirection() === PaddleDirection.UP) {
        this.direction = BallDirection.R_UP;
      } else if (this.paddleLeft.getDirection() === PaddleDirection.DOWN) {
        this.direction = BallDirection.R_DOWN;
      }
      return;
    }
  }
}
