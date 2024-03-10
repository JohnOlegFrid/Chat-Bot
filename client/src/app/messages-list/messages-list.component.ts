import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MessageFromServer } from '../general.interface';
import { messageComponent } from '../message/message.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { StateService } from '../services/state-service/state.service';
import { ApiService } from '../services/api-service/api.service';
import { Element } from '@angular/compiler';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [messageComponent, CommonModule],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.scss'
})
export class messagesListComponent {
  @ViewChild('listWrapper') messagesList!:ElementRef;
  stateService: StateService = inject(StateService);
  apiService: ApiService = inject(ApiService);
  messages$: BehaviorSubject<MessageFromServer[]> = this.stateService.getMessages();

  ngOnInit() {
    this.apiService.getMessages(20, 1);
    this.messages$.subscribe(e=> {
      setTimeout(()=>{
        this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight
      },0)
      
    })
  }
}
