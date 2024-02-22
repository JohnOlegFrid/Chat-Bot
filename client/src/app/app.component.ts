import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { InputComponent } from './input/input.component';
import { SocketIoService } from './services/socket-io-service/socket-io.service'
import { ApiService } from './services/api-service/api.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { BotDialogComponent } from './bot-dialog/bot-dialog.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuestionsListComponent, InputComponent, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  socketIoService: SocketIoService = inject(SocketIoService);
  apiService: ApiService = inject(ApiService);

  constructor(public dialog: MatDialog){}
  processNewQuestion(text: string) {
    
    this.apiService.getAnswersToSimilarQuestions(text).subscribe(data=> {
      if (data) {
        this.dialog.open(BotDialogComponent, {
          data,
        });
      } else {
        this.socketIoService.addNewQuestion(text);
      }
    });
    
  }
}
