import { Injectable } from '@angular/core';
import { LocalStorage, MessageFromServer } from '../../general.interface';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  constructor() { }

  getTime(dateRaw:string) {
    let date = new Date(dateRaw);
    return this.zeroPad(date.getHours()) + ':' + this.zeroPad(date.getMinutes()) + ' ' + date.toLocaleDateString('en-US',{ weekday: 'long' });
  }

  zeroPad (num: number, places= 2){
    return String(num).padStart(places, '0')
  } 

  setMyProperty(message: MessageFromServer){
    message.my = localStorage.getItem(LocalStorage.username) === message.senderName;
  }
}
