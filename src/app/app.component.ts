import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { NavController, Platform } from '@ionic/angular';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private navController: NavController,
    private authService: AuthService,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    // await this.platform.ready();
    // this.isUserAuthenticated();
  }

  // async isUserAuthenticated() {
  //   SplashScreen.hide();

  //   // const accessToken = await this.authService.getAccessToken();
  //   const accessToken = 'jwt';
  //   if (accessToken) {
  //     // this.authService.getAndSetUserAttributes(accessToken);
  //     this.navController.navigateRoot('tabs', { replaceUrl: true });
  //   } else {
  //     this.navController.navigateRoot('login', { replaceUrl: true });
  //   }
  // }
}
