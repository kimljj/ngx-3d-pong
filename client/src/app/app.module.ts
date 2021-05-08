import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketIoModule } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { PongGameComponent } from './pong/pong.component';
import { HttpClientModule } from '@angular/common/http';
import { config } from '../config/socketConfig';

@NgModule({
  declarations: [
    AppComponent,
    PongGameComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
