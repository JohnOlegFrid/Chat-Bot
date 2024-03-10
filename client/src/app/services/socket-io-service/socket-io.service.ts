import { Injectable, inject } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Reply, MessageFromServer, LocalStorage } from '../../general.interface';
import { StateService } from '../state-service/state.service';
import { IconOptions } from '@angular/material/icon';

const NewMessageChanel = 'addMessage'
const NewReplyChanel = 'addReplyToMessage'
const GetMessages = 'getMessages'
const NewMessagePublished = 'newMessagePublished'
const NewReplyPublished = 'newReplyPublished'
const PageSize = 20;

@Injectable({
  providedIn: 'root'
})



export class SocketIoService {
  private socket!:Socket;
  stateService: StateService = inject(StateService);

  messages$ = new BehaviorSubject<MessageFromServer[]>([]);
  answers$: Record<string, BehaviorSubject<Reply[]>> = {};

  constructor() {
    // this.socket.emit(GetMessages,1, 20);
    // this.socket.on(GetMessages, (messages: MessageFromServer[]) => {
    //   this.stateService.setMessages(messages)
    // })
  }

  connect() {
    this.socket = io(environment.apiUrl,  { transports : ['websocket'], auth: {username: localStorage.getItem(LocalStorage.username)}})
    
    this.socket.on(NewMessagePublished, (message: MessageFromServer) => {
      this.stateService.addOneMessage(message);
    })

    this.socket.on(NewReplyPublished, (reply: Reply) => {
      this.stateService.addOneReply(reply);
    })
  }
  addNewMessage(text: string){
    this.socket.emit(NewMessageChanel, text);
  }

  addNewReply(messageId: string, text: string){
    this.socket.emit(NewReplyChanel, messageId, text);
  }

  getMessages(){
    return this.messages$;
  }
}
