import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  datePipe = new DatePipe('pt-BR');

  years = [
    '2021',
    '2022',
  ];

  months = [
    {
      text: 'Janeiro',
      value: 0,
    },
    {
      text: 'Fevereiro',
      value: 1,
    },
    {
      text: 'Março',
      value: 2,
    },
    {
      text: 'Abril',
      value: 3,
    },
    {
      text: 'Maio',
      value: 4,
    },
    {
      text: 'Junho',
      value: 5,
    },
    {
      text: 'Julho',
      value: 6,
    },
    {
      text: 'Agosto',
      value: 7,
    },
    {
      text: 'Setembro',
      value: 8,
    },
    {
      text: 'Outubro',
      value: 9,
    },
    {
      text: 'Novembro',
      value: 10,
    },
    {
      text: 'Dezembro',
      value: 11,
    },
  ];

  constructor(
    private toastController: ToastController,
  ) { }

  async showToastController(message: string, color: string, position: 'top' | 'bottom' | 'middle', duration = 2500, icon: string = '') {
    if (await this.toastController.getTop()) {
      this.toastController.dismiss();
    }

    const toast = await this.toastController.create({
      message,
      color,
      position,
      duration,
      icon,
      cssClass: 'toast-controller',
    });

    toast.present();
  }
}
