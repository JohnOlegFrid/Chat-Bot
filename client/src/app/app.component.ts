import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { InputComponent } from './input/input.component';
import { SocketIoService } from './services/socket-io-service/socket-io.service'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuestionsListComponent, InputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  socketIoService: SocketIoService = inject(SocketIoService);

  processNewQuestion(text: string) {
    this.socketIoService.addNewQuestion(text);
  }
}
