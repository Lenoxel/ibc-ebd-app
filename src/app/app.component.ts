import { Component, OnInit } from '@angular/core';
import { MessagingService } from './services/messaging/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() // private messagingService: MessagingService
  {}

  ngOnInit() {
    // this.messagingService.requestPermission();
    // this.messagingService.receiveMessage();
  }
}
