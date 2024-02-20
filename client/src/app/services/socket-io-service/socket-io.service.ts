import { Injectable, inject } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Answer, Question, QuestionFromServer } from '../../general.interface';
import { StateService } from '../state-service/state.service';

const NewQuestionChanel = 'addQuestion'
const NewAnswerChanel = 'addAnswer'
const GetQuestions = 'getQuestions'
const NewQuestionPublished = 'newQuestionPublished'
const NewAnswerPublished = 'newAnswerPublished'
const PageSize = 20;

@Injectable({
  providedIn: 'root'
})



export class SocketIoService {
  private socket = io(environment.apiUrl,  { transports : ['websocket'] });
  stateService: StateService = inject(StateService);

  questions$ = new BehaviorSubject<QuestionFromServer[]>([]);
  answers$: Record<string, BehaviorSubject<Answer[]>> = {};

  constructor() {
    this.socket.emit(GetQuestions,1, 20);
    this.socket.on(GetQuestions, (questions: QuestionFromServer[]) => {
      this.questions$.next(this.questions$.value.concat(questions));
    })

    this.socket.on(NewQuestionPublished, (question: QuestionFromServer) => {
      this.stateService.setQuestions([question]);
    })

    this.socket.on(NewAnswerPublished, (answer: Answer) => {
      this.stateService.setOneAnswer(answer);
    })
  }

  addNewQuestion(text: string){
    this.socket.emit(NewQuestionChanel, text);
  }

  addNewAnswer(qid: string, text: string){
    this.socket.emit(NewAnswerChanel, qid, text);
  }

  getQuestions(){
    return this.questions$;
  }
}
