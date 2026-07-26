import { Component, OnInit } from '@angular/core';
// import { MessagingService } from './services/messaging/messaging.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { UtilService } from './services/util/util.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private swUpdate: SwUpdate,
    private utilService: UtilService,
  ) {
    // private messagingService: MessagingService,
  }

  ngOnInit() {
    // this.messagingService.requestPermission();
    // this.messagingService.receiveMessage();

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter(
            (evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY',
          ),
        )
        .subscribe(() => {
          this.swUpdate.activateUpdate().then(() => {
            this.utilService.showToastController(
              'O app tem uma nova versão e será atualizado em alguns instantes!',
              'light',
              'top',
              5000,
              '',
              [
                {
                  text: 'OK',
                  role: 'cancel',
                },
              ],
            );

            setTimeout(() => {
              document.location.reload();
            }, 7500);
          });
        });
    }
  }
}
