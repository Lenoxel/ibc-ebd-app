 import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SearchbarOptions } from 'src/app/types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() headerTitle = '';
  @Input() headerMarginTop = '0px';
  @Input() searchbarOptions: SearchbarOptions | null = null;
  @Output() refreshAction = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private alertController: AlertController,
    private navController: NavController,
  ) { }

  ngOnInit() {}

  onContentScroll(event) {
    this.headerMarginTop = `-${event?.detail?.scrollTop * 0.75}px`;
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza que deseja sair da aplicação?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
        }, {
          text: 'Sim',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
    await this.authService.logout();
    this.navController.navigateRoot('login', { replaceUrl: true });
  }

}
