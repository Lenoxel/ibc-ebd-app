 import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, NavController, SelectCustomEvent } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ButtonOptions, EntityBasic, SearchbarOptions, SelectOptions } from 'src/app/types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() headerTitle = '';
  @Input() hideHeader = false;
  @Input() marginTop = '0px';
  @Input() searchbarOptions: SearchbarOptions | null = null;
  @Input() selectOptions: SelectOptions<EntityBasic> | null = null;
  @Input() buttonOptions: ButtonOptions | null = null;
  @Output() refreshEvent = new EventEmitter<void>();
  @Output() selectEvent = new EventEmitter<EntityBasic>();
  @Output() searchEvent = new EventEmitter<string>();
  @Output() buttonClickEvent = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private alertController: AlertController,
    private navController: NavController,
  ) {}

  ngOnInit() {}

  doSelect(event: SelectCustomEvent) {
    this.selectOptions.choosedItem = event?.detail?.value;
    this.selectEvent.emit(event?.detail?.value || null);
  }

  doSearch(event: { target: HTMLInputElement }) {
    this.searchEvent.emit(event?.target?.value || '');
  }

  doButtonAction() {
    this.buttonClickEvent.emit();
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
