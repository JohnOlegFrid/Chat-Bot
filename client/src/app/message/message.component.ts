import { Component, Input, ViewChild, inject } from '@angular/core';
import { Reply, MessageFromServer } from '../general.interface';
import {MatExpansionModule} from '@angular/material/expansion';
import { InputComponent } from '../input/input.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api-service/api.service'
import { BehaviorSubject } from 'rxjs';
import { SocketIoService } from '../services/socket-io-service/socket-io.service';
import { StateService } from '../services/state-service/state.service';
import { UtilsService } from '../services/utils-service/utils.service';
@Component({
  selector: 'app-message',
  standalone: true,
  imports: [MatExpansionModule, InputComponent, CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})

export class messageComponent {
  @ViewChild(InputComponent) answerElement!:InputComponent;
  public utilsService = inject(UtilsService)
  panelOpenState = false;
  isOpenBefore = false;
  apiService: ApiService = inject(ApiService);
  stateService: StateService = inject(StateService);
  socketIoService: SocketIoService = inject(SocketIoService);
  answers$: BehaviorSubject<Reply[]> | undefined;
  isAnswersLoading$ : BehaviorSubject<boolean> | undefined;
  @Input() message: MessageFromServer | undefined;


  constructor() {
  }

  ngOnInit(){
    let answerObj  = this.stateService.getAnswers(this.message!.id);
    this.answers$ = answerObj.value$;
    this.isAnswersLoading$ = answerObj.isLoading$;
  }
  openPanel(){
    this.panelOpenState= !this.panelOpenState;
    if (!this.isOpenBefore && this.panelOpenState) this.apiService.getRepliesByMessageId(this.message?.id!);
    this.isOpenBefore = true;
    
  }

  addNewAnswer(text:string){
    this.socketIoService.addNewReply(this.message!.id, text);
    this.answerElement.clearValue();
  }
}
