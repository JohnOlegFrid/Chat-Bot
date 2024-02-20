import { Injectable } from '@angular/core';
import { Answer, QuestionFromServer } from '../../general.interface';
import { BehaviorSubject } from 'rxjs';

export interface StateEntity<T> {
    isLoading$: BehaviorSubject<boolean>;
    value$: BehaviorSubject<T>,
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  questions$ = new BehaviorSubject<QuestionFromServer[]>([]);
  answers$: Record<Answer['questionId'],StateEntity<Answer[]>> = {}
  constructor() { }

  setQuestions(questions: QuestionFromServer[] ) {
    questions.forEach(question => {
      if (!this.answers$[question.id]) {
        this.answers$[question.id] = {
                isLoading$:new BehaviorSubject<boolean>(false),
                value$: new BehaviorSubject<Answer[]>([])
            }
        }
      })
    this.questions$.next(this.questions$.value.concat(questions))
  }
  
  
  getQuestions() {
    return this.questions$;
  }

  getAnswers(qid: Answer['questionId']) {
    return this.answers$[qid];
  }


  setAnswers(answers: Answer[] ) {
    const dict:Record<Answer['questionId'], Answer[]> = {};
    answers.forEach(answer=> {
      if (!dict[answer.questionId]){
        dict[answer.questionId] = [];
      }
      dict[answer.questionId].push(answer);
    });

    for (const [qid, answers] of Object.entries(dict)) {
      if (!this.answers$[qid]) {
          this.answers$[qid] = {
              isLoading$:new BehaviorSubject<boolean>(false),
              value$: new BehaviorSubject<Answer[]>([])
          }
      }
      this.answers$[qid].value$.next(this.answers$[qid].value$.value.concat(answers));
    }
  }

  setOneAnswer(answer: Answer ) {
    const qid = answer.questionId;
    if (!this.answers$[qid]) {
        this.answers$[qid] = {
            isLoading$:new BehaviorSubject<boolean>(false),
            value$: new BehaviorSubject<Answer[]>([])
        }
    }
    this.answers$[qid].value$.next(this.answers$[qid].value$.value.concat(answer));
    
  }

}
