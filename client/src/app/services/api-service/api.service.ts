import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { environment } from '../../../environments/environment';
import { Answer, QuestionFromServer } from '../../general.interface';
import { catchError, throwError } from 'rxjs';
import { StateService } from '../state-service/state.service';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  apiUrl = environment.apiUrl;
  stateService: StateService = inject(StateService);
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8').set('Access-Control-Allow-Origin','*');
  constructor(private http: HttpClient) { }

  getAnswersByQuestionId(questionsId: string){

    return this.http.get<Answer[]>(`${this.apiUrl}/answers/${questionsId}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    ).subscribe(answers => {
      this.stateService.setAnswers(answers);
    })
  }

  getQuestions(pageSize:number, pageNumber:number){
    return this.http.get<QuestionFromServer[]>(`${this.apiUrl}/questions?pageSize=${pageSize}&pageNumber=${pageNumber}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    ).subscribe(questions => {
      this.stateService.setQuestions(questions);
    })
  }
}
