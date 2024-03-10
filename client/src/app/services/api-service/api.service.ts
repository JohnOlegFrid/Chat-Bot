import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { environment } from '../../../environments/environment';
import { Reply, MessageFromServer } from '../../general.interface';
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

  getRepliesByMessageId(messagesId: string){
    return this.http.get<Reply[]>(`${this.apiUrl}/replies/${messagesId}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    ).subscribe(answers => {
      this.stateService.setAnswers(answers);
    })
  }

  getMessages(pageSize:number, pageNumber:number){
    return this.http.get<MessageFromServer[]>(`${this.apiUrl}/messages?pageSize=${pageSize}&pageNumber=${pageNumber}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    ).subscribe(messages => {
      this.stateService.setMessages(messages);
    })
  }

  getAnswersToSimilarMessages(text: string){
    return this.http.get<Reply[]>(`${this.apiUrl}/replies-to-similar-message`,{params:{text}}).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    )
  }
}
