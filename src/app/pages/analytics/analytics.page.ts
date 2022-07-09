import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UtilService } from 'src/app/services/util/util.service';
import randomColor from 'randomcolor';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Autoplay, Keyboard, Pagination, SwiperOptions } from 'swiper';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

SwiperCore.use([Autoplay, Keyboard, Pagination]);
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit, AfterViewInit {
  @ViewChild('lineCanvasPresences') private lineCanvasPresences: ElementRef;
  @ViewChild('doubleLineCanvas') private doubleLineCanvas: ElementRef;
  // @ViewChild('barCanvas') private barCanvas: ElementRef;
  // @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  @ViewChild('swiperExemplaryStudents', { static: true }) private swiperExemplaryStudents: SwiperComponent;
  @ViewChild('swiperWorryingStudents', { static: true }) private swiperWorryingStudents: SwiperComponent;

  hideHeader$ = new Subject<boolean>();
  hideHeader = false;

  lineChartPresences: Chart;
  lineChartAbsences: Chart;
  doubleLineChart: any;
  // barChart: Chart;
  // doughnutChart: Chart;

  swiperExemplaryStudentsConfig: SwiperOptions = {
    slidesPerView: 1.0,
    pagination: true,
    keyboard: true,
    autoplay: true,
  };

  swiperWorryingStudentsConfig: SwiperOptions = {
    slidesPerView: 1.0,
    pagination: true,
    keyboard: true,
    autoplay: true,
  };

  classes = [
    {
      name: 'Novo Viver',
      enrolled: 27,
      absents: 8,
      visitors: 4,
      presents: 19,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Gideão',
      enrolled: 21,
      absents: 10,
      visitors: 1,
      presents: 11,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: true,
    },
    {
      name: 'Adriel',
      enrolled: 17,
      absents: 4,
      presents: 13,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Ouro de Ofir',
      enrolled: 18,
      absents: 8,
      visitors: 1,
      presents: 10,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'El Shaday',
      enrolled: 24,
      absents: 5,
      presents: 19,
      presentsPercentual: null,
      bestFrequency: true,
      worstFrequency: null,
    },
    {
      name: 'Sabaot',
      enrolled: 22,
      absents: 6,
      presents: 16,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Emanuel',
      enrolled: 18,
      absents: 8,
      visitors: 2,
      presents: 10,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Ágape',
      enrolled: 28,
      absents: 7,
      presents: 21,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Peniel',
      enrolled: 30,
      absents: 11,
      presents: 19,
      visitors: 2,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Judá',
      enrolled: 32,
      absents: 10,
      presents: 22,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Doxa',
      enrolled: 35,
      absents: 8,
      visitors: 1,
      presents: 27,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Maternal',
      enrolled: 12,
      absents: 3,
      presents: 9,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Jardim',
      enrolled: 16,
      absents: 5,
      presents: 11,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Primários',
      enrolled: 20,
      absents: 7,
      presents: 13,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
    {
      name: 'Juniores',
      enrolled: 8,
      absents: 3,
      presents: 5,
      presentsPercentual: null,
      bestFrequency: null,
      worstFrequency: null,
    },
  ];

  sundaysOfMonth = ['27 de Março', '20 de Março', '13 de Março', '06 de Março', 'Todos os domingos de Março (média)'];

  selectedYear = String(new Date().getFullYear());
  selectedMonth = new Date().getMonth();
  selectedSunday = '27 de Março';

  exemplaryStudents = [
    {
      name: 'Doninho',
      picture: '',
      infos: [{
        title: 'Pontual',
        count: 26
      }, {
        title: 'Assíduo',
        count: 31
      }],
    },
    {
      name: 'Gabriel Lenon',
      picture: 'https://res.cloudinary.com/dps5k8b3f/image/upload/v1630780319/imnhaqy1ob8ugwcdqpyw.jpg',
      infos: [{
        title: 'Participativo',
        count: 7
      }, {
        title: 'Assíduo',
        count: 14
      }],
    },
    {
      name: 'Rebeka Beatriz',
      picture: '',
      infos: [{
        title: 'Pontual',
        count: 23
      }, {
        title: 'Assídua',
        count: 16
      }, {
        title: 'Colaborativa',
        count: 9
      }],
    },
    {
      name: 'Anderson Neves',
      picture: '',
      infos: [{
        title: 'Pontual',
        count: 17
      }, {
        title: 'Colaborativo',
        count: 14
      }],
    },
  ];

  worryingStudents = [
    {
      name: 'Ricardo José',
      picture: '',
      infos: [{
        title: 'Não pontual',
        count: 7
      }, {
        title: 'Não assíduo',
        count: 18
      }],
    },
    {
      name: 'Felipe Alves',
      picture: '',
      infos: [{
        title: 'Não pontual',
        count: 13
      }],
    },
    {
      name: 'Fernanda Dalina',
      picture: '',
      infos: [{
        title: 'Descompromissada',
        count: 8
      }, {
        title: 'Não assídua',
        count: 19
      }],
    },
  ];

  constructor(
    public utilService: UtilService,
    public authService: AuthService,
    private navController: NavController,
  ) {
    this.hideHeader$.pipe(
      debounceTime(20),
      distinctUntilChanged(),
    ).subscribe((hideHeader: boolean) => this.hideHeader = hideHeader);
  }

  ngOnInit(): void {
    this.calculateClassesFrequency();
  }

  ngAfterViewInit() {
    this.lineChartPresencesMethod();
    this.doubleLineChartMethod();
    // this.barChartMethod();
    // this.doughnutChartMethod();
  }

  getAnalytics() {}

  calculateClassesFrequency(): void {
    this.classes = this.classes.map(ebdClass => ({
      ...ebdClass,
      presentsPercentual: ebdClass.presents / ebdClass.enrolled,
    }));
  }

  onContentScroll(event: CustomEvent) {
    this.hideHeader$.next(event?.detail?.deltaY > 0 ? true : false);
  }

  async logout() {
    await this.authService.logout();
    this.navController.navigateRoot('login', { replaceUrl: true });
  }

  lineChartPresencesMethod() {
    const greenColor = randomColor({
      hue: 'green',
      format: 'rgba',
      alpha: 0.4,
    });

    const redColor = randomColor({
      hue: 'red',
      format: 'rgba',
      alpha: 0.4,
    });

    this.lineChartPresences = new Chart(this.lineCanvasPresences.nativeElement, {
      type: 'line',
      data: {
        labels: ['08/05', '15/05', '22/05', '29/05', '05/06', '12/06', '19/06', '26/06'],
        datasets: [
          {
            label: 'Presentes',
            fill: true,
            tension: 0.5,
            backgroundColor: greenColor,
            borderColor: greenColor.replace('0.4', '1.0'),
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: greenColor.replace('0.4', '1.0'),
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: greenColor.replace('0.4', '1.0'),
            pointHoverBorderColor: 'rgba(50, 37, 20, 1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [199, 208, 212, 271, 252, 287, 249, 216],
            spanGaps: false,
          },
          {
            label: 'Ausentes',
            fill: true,
            tension: 0.5,
            backgroundColor: redColor,
            borderColor: redColor.replace('0.4', '1.0'),
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: redColor.replace('0.4', '1.0'),
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: redColor.replace('0.4', '1.0'),
            pointHoverBorderColor: 'rgba(50, 37, 20, 1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [116, 97, 98, 32, 55, 17, 74, 95],
            spanGaps: false,
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 1.89,
        scales: {
          y: {
            ticks: {
              font: {
                size: 14,
              },
            }
          },
          x: {
            ticks: {
              font: {
                size: 14,
              },
            }
          },
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 14,
              }
            }
          }
        },
      }
    });
  }

  doubleLineChartMethod() {
    const randomColorsList = randomColor({
      count: this.classes.length,
      // hue: '#be1558',
      // hue: 'blue',
      // luminosity: 'light',
      format: 'rgba',
      alpha: 0.7,
    });

    this.doubleLineChart = new Chart(this.doubleLineCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['02/01', '09/01', '16/01', '23/01'],
        datasets: this.classes.map(({ name: label }, index) => ({
          label,
          data: [
            Math.round((Math.random() * 30)),
            Math.round((Math.random() * 30)),
            Math.round((Math.random() * 30)),
            Math.round((Math.random() * 30))
          ],
          backgroundColor: randomColorsList[index],
          borderColor: randomColorsList[index].replace('0.7', '1.0'),
          fill: false,
          tension: 0.3,
          pointRadius: 5,
        })),
      },
      options: {
        responsive: true,
        aspectRatio: 2.75,
        scales: {
          y: {
            ticks: {
              font: {
                size: 14,
              },
            }
          },
          x: {
            ticks: {
              font: {
                size: 14,
              },
            }
          },
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16,
              }
            }
          }
        },
      }
    });
  }

  barChartMethod() {
    // this.barChart = new Chart(this.barCanvas.nativeElement, {
    //   type: 'bar',
    //   data: {
    //     labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [200, 50, 30, 15, 20, 34],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)'
    //       ],
    //       borderColor: [
    //         'rgba(255,99,132,1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: {
    //         beginAtZero: true
    //       },
    //     }
    //   }
    // });
  }

  doughnutChartMethod() {
    // this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['BJP', 'Congress', 'AAP', 'CPM', 'SP'],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [50, 29, 15, 10, 7],
    //       backgroundColor: [
    //         'rgba(255, 159, 64, 0.2)',
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)'
    //       ],
    //       hoverBackgroundColor: [
    //         '#FFCE56',
    //         '#FF6384',
    //         '#36A2EB',
    //         '#FFCE56',
    //         '#FF6384'
    //       ]
    //     }]
    //   }
    // });
  }

}
