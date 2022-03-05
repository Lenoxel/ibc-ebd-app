import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialsFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
  ) {}

  get username() {
    return this.credentialsFormGroup.get('username');
  }

  get password() {
    return this.credentialsFormGroup.get('password');
  }

  ngOnInit() {
    this.credentialsFormGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credentialsFormGroup.value).subscribe({
      next: async (token) => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      error: async (res) => {
        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Erro no Login',
          message: res?.error?.error || res?.error?.detail || 'Por favor, tente novamente.',
          buttons: ['OK'],
        });

        await alert.present();
      }
    });
  }
}
