import { Component, EventEmitter, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import { LocalStorage } from '../general.interface';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../input/input.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, MatCardModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {userNameSet: EventEmitter<boolean>},    
  ) {}

  onInputSubmit(text: string) {
    localStorage.setItem(LocalStorage.username, text);
    this.data.userNameSet.emit(true);
    this.dialogRef.close();
  }
}
