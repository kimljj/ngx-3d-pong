import { Component, ElementRef, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Game } from '../classes/Game';

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.scss']
})
export class PongGameComponent implements OnInit {
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  private game: Game;

  constructor(private socket: Socket) {
  }

  ngOnInit(): void {
    this.socket.on('connect', () => {
      this.game = new Game('worldCanvas', this.socket);

      this.game.createScene();

      this.game.render();
    });
  }
}
