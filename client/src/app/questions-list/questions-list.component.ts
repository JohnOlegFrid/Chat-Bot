import { Component, inject } from '@angular/core';
import { QuestionFromServer } from '../general.interface';
import { QuestionComponent } from '../question/question.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { StateService } from '../services/state-service/state.service';
import { ApiService } from '../services/api-service/api.service';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [QuestionComponent, CommonModule],
  templateUrl: './questions-list.component.html',
  styleUrl: './questions-list.component.scss'
})
export class QuestionsListComponent {
  stateService: StateService = inject(StateService);
  apiService: ApiService = inject(ApiService);
  questions$: BehaviorSubject<QuestionFromServer[]> = this.stateService.getQuestions();

  ngOnInit() {
    this.apiService.getQuestions(20, 1);
  }
}
