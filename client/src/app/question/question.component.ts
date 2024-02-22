import { Component, Input, ViewChild, inject } from '@angular/core';
import { Answer, QuestionFromServer } from '../general.interface';
import {MatExpansionModule} from '@angular/material/expansion';
import { InputComponent } from '../input/input.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api-service/api.service'
import { BehaviorSubject } from 'rxjs';
import { SocketIoService } from '../services/socket-io-service/socket-io.service';
import { StateService } from '../services/state-service/state.service';
@Component({
  selector: 'app-question',
  standalone: true,
  imports: [MatExpansionModule, InputComponent, CommonModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})

export class QuestionComponent {
  @ViewChild(InputComponent) answerElement!:InputComponent;
  panelOpenState = false;
  isOpenBefore = false;
  apiService: ApiService = inject(ApiService);
  stateService: StateService = inject(StateService);
  socketIoService: SocketIoService = inject(SocketIoService);
  answers$: BehaviorSubject<Answer[]> | undefined;
  isAnswersLoading$ : BehaviorSubject<boolean> | undefined;
  @Input() question: QuestionFromServer | undefined;


  constructor() {
  }

  ngOnInit(){
    let answerObj  = this.stateService.getAnswers(this.question!.id);
    this.answers$ = answerObj.value$;
    this.isAnswersLoading$ = answerObj.isLoading$;
  }
  openPanel(){
    this.panelOpenState= !this.panelOpenState;
    if (!this.isOpenBefore && this.panelOpenState) this.apiService.getAnswersByQuestionId(this.question?.id!);
    this.isOpenBefore = true;
    
  }

  addNewAnswer(text:string){
    this.socketIoService.addNewAnswer(this.question!.id, text);
    this.answerElement.clearValue();
  }
}
