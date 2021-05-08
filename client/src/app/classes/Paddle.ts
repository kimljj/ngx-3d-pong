import { CODE_A, CODE_D, CODE_DOWN, CODE_LEFT, CODE_RIGHT, CODE_S, CODE_UP, CODE_W } from 'keycode-js';
import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { PaddleDirection } from '../../../../shared/enums/BallDirection';
import { PlayerPosition } from '../../../../shared/enums/PlayerPosition';

export default class Paddle {
  public mesh: Mesh;
  public position: string;
  public direction: PaddleDirection;

  constructor(paddlePosition: string,
              private scene: Scene) {
    this.position = paddlePosition;

    this.drawPaddle();

    this.locatePaddle();

    // enable collisions
    this.mesh.checkCollisions = true;

    // initial direction
    this.direction = PaddleDirection.NONE;
  }

  public handleEvent(): void {
    window.addEventListener('keydown',
      (event) => {
        if (this.position === PlayerPosition.UP || this.position === PlayerPosition.DOWN) {
          switch (event.code) {
            case CODE_LEFT:
            case CODE_A:
              this.mesh.position.z -= 0.01;
              this.direction = PaddleDirection.LEFT;
              break;
            case CODE_RIGHT:
            case CODE_D:
              this.mesh.position.z += 0.01;
              this.direction = PaddleDirection.RIGHT;
              break;
            default:
              break;
          }
          return;
        }

        if (this.position === PlayerPosition.LEFT || this.position === PlayerPosition.RIGHT) {
          switch (event.code) {
            case CODE_UP:
            case CODE_W:
              this.mesh.position.x -= 0.01;
              this.direction = PaddleDirection.DOWN;
              break;
            case CODE_DOWN:
            case CODE_S:
              this.mesh.position.x += 0.01;
              this.direction = PaddleDirection.UP;
              break;
            default:
              break;
          }
          return;
        }
      });
  }

  public getDirection(): PaddleDirection {
    return this.direction;
  }

  private drawPaddle(): void {
    if (this.position === PlayerPosition.LEFT || this.position === PlayerPosition.RIGHT) {
      this.mesh = MeshBuilder.CreateBox(this.position, {
        depth: 2,
        width: 100,
        height: 10
      }, this.scene);
    } else {
      this.mesh = MeshBuilder.CreateBox(this.position, {
        depth: 100,
        width: 2,
        height: 10
      }, this.scene);
    }

    const mat = new StandardMaterial('paddleMaterial', this.scene);

    // prepare the material
    mat.diffuseColor = new Color3(0, 0, 1);

    // add color to a paddle
    this.mesh.material = mat;
  }

  private locatePaddle(): void {
    switch (this.position) {
      case PlayerPosition.UP:
        this.mesh.position = new Vector3(-50, 0, 0);
        break;
      case PlayerPosition.DOWN:
        this.mesh.position = new Vector3(50, 0, 0);
        break;
      case PlayerPosition.RIGHT:
        this.mesh.position = new Vector3(0, 0, 50);
        break;
      case PlayerPosition.LEFT:
        this.mesh.position = new Vector3(0, 0, -50);
        break;
      default:
        break;
    }
  }
}
