import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import { Answer } from '../general.interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-bot-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './bot-dialog.component.html',
  styleUrl: './bot-dialog.component.scss'
})
export class BotDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Answer[],    
  ) {}
}
