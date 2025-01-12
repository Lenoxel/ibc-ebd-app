import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FakeArrayPipe } from 'src/app/pipes/fake-array/fake-array.pipe';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  datePipe = new DatePipe('pt-BR');
  fakeArrayPipe = new FakeArrayPipe();

  years = ['2022', '2023', '2024', '2025'];

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

  sundaysOfMonth: number[] = [];

  constructor(private toastController: ToastController) {}

  setSundaysOnMonth(
    month: number = new Date().getMonth(),
    year: number = new Date().getFullYear()
  ) {
    const days = new Date(year, month + 1, 0).getDate();
    const sundays = [8 - new Date(`${month + 1}/01/${year}`).getDay()];

    for (let sunday = sundays[0] + 7; sunday < days; sunday += 7) {
      sundays.push(sunday);
    }

    this.sundaysOfMonth = [...sundays];
  }

  geLastEbdDate() {
    const lastEbdDate = new Date();

    lastEbdDate.setDate(lastEbdDate.getDate() - lastEbdDate.getDay());

    return {
      day: String(lastEbdDate.getDate()),
      month: String(lastEbdDate.getMonth() + 1),
      year: String(lastEbdDate.getFullYear()),
    };
  }

  dateToString(date: Date) {
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const month =
      date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  async showToastController(
    message: string,
    color: string,
    position: 'top' | 'bottom' | 'middle',
    duration = 2500,
    icon: string = ''
  ) {
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
