import { Injectable, inject } from '@angular/core';
import { Reply, MessageFromServer, LocalStorage } from '../../general.interface';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from '../utils-service/utils.service';

export interface StateEntity<T> {
    isLoading$: BehaviorSubject<boolean>;
    value$: BehaviorSubject<T>,
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  utilsService = inject(UtilsService);
  messages$ = new BehaviorSubject<MessageFromServer[]>([]);
  answers$: Record<Reply['replyToMessageId'],StateEntity<Reply[]>> = {}
  constructor() { }

  setMessages(messages: MessageFromServer[] ) {
    messages.forEach(message => {
      this.utilsService.setMyProperty(message);
      if (!this.answers$[message.id]) {
        this.answers$[message.id] = {
                isLoading$:new BehaviorSubject<boolean>(false),
                value$: new BehaviorSubject<Reply[]>([])
            }
        }
      })
    this.messages$.next(this.messages$.value.concat(messages))
  }
  
  
  getMessages() {
    return this.messages$;
  }

  getAnswers(qid: Reply['replyToMessageId']) {
    return this.answers$[qid];
  }


  setAnswers(answers: Reply[] ) {
    const dict:Record<Reply['replyToMessageId'], Reply[]> = {};
    answers.forEach(answer=> {
      if (!dict[answer.replyToMessageId]){
        dict[answer.replyToMessageId] = [];
      }
      dict[answer.replyToMessageId].push(answer);
    });

    for (const [qid, answers] of Object.entries(dict)) {
      if (!this.answers$[qid]) {
          this.answers$[qid] = {
              isLoading$:new BehaviorSubject<boolean>(false),
              value$: new BehaviorSubject<Reply[]>([])
          }
      }
      this.answers$[qid].value$.next(answers);
    }
  }

  addOneReply(answer: Reply ) {
    const qid = answer.replyToMessageId;
    if (!this.answers$[qid]) {
        this.answers$[qid] = {
            isLoading$:new BehaviorSubject<boolean>(false),
            value$: new BehaviorSubject<Reply[]>([])
        }
    }
    this.answers$[qid].value$.next([answer].concat(this.answers$[qid].value$.value));
    
  }

  addOneMessage(message: MessageFromServer ) {
    this.utilsService.setMyProperty(message);
    if (!this.answers$[message.id]) {
        this.answers$[message.id] = {
          isLoading$:new BehaviorSubject<boolean>(false),
          value$: new BehaviorSubject<Reply[]>([])
        }
    }
    this.messages$.next([message].concat(this.messages$.value))
  }


}
