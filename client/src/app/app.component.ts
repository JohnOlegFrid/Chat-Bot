import { Component, EventEmitter, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { messagesListComponent } from './messages-list/messages-list.component';
import { InputComponent } from './input/input.component';
import { SocketIoService } from './services/socket-io-service/socket-io.service'
import { ApiService } from './services/api-service/api.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { BotDialogComponent } from './bot-dialog/bot-dialog.component';
import { LoginComponent } from './login/login.component';
import { LocalStorage } from './general.interface';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, messagesListComponent, InputComponent, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  socketIoService: SocketIoService = inject(SocketIoService);
  apiService: ApiService = inject(ApiService);

  constructor(public dialog: MatDialog){
    if (!localStorage[LocalStorage.username]){
      let userNameSet$ = new EventEmitter();
       this.dialog.open(LoginComponent, {
        data: {userNameSet: userNameSet$},
        disableClose:true  
      });
      userNameSet$.subscribe(_=>{
        this.socketIoService.connect();
      })
    } else {
      this.socketIoService.connect();
    }
  }
  processNewMessage(text: string) {
    this.apiService.getAnswersToSimilarMessages(text).subscribe(data=> {
      if (data) {
        this.dialog.open(BotDialogComponent, {
          data,
        });
      } else {
        this.socketIoService.addNewMessage(text);
      }
    });
    
  }
}
