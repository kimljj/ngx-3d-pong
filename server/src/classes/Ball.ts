import Coordinate from '../../../shared/classes/Coordinate';
import { BallDirection } from '../../../shared/enums/BallDirection';

export default class Ball {
  public direction: BallDirection;
  public coordinate: Coordinate;

  constructor(direction) {
    this.direction = direction;
    this.coordinate = new Coordinate();
  }

  public move() {
    switch (this.direction) {
      case BallDirection.DOWN:
        this.coordinate.x += 0.5;
        break;
      case BallDirection.UP:
        this.coordinate.x -= 0.5;
        break;
      case BallDirection.LEFT:
        this.coordinate.z -= 0.5;
        break;
      case BallDirection.RIGHT:
        this.coordinate.z += 0.5;
        break;
      case BallDirection.L_DOWN:
        this.coordinate.x += 0.5;
        this.coordinate.z -= 0.5;
        break;
      case BallDirection.R_DOWN:
        this.coordinate.x += 0.5;
        this.coordinate.z += 0.5;
        break;
      case BallDirection.L_UP:
        this.coordinate.x -= 0.5;
        this.coordinate.z -= 0.5;
        break;
      case BallDirection.R_UP:
        this.coordinate.x -= 0.5;
        this.coordinate.z += 0.5;
        break;
    }

    return this;
  }
}
