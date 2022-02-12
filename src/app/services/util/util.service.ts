import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
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

  constructor() { }
}
