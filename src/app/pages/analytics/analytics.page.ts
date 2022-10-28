import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UtilService } from 'src/app/services/util/util.service';
// import randomColor from 'randomcolor';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavController, ViewDidEnter } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import {
  IAnalyticsPresenceClassInfos,
  IAnalyticsPresenceCounts,
  IAnalyticsPresenceHistory,
  IAnalyticsPresenceUsers
} from 'src/app/interfaces';
import { DateFilter } from 'src/app/types';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit, ViewDidEnter {
  @ViewChild('doubleLineCanvas') private doubleLineCanvas: ElementRef;
  // @ViewChild('barCanvas') private barCanvas: ElementRef;
  // @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  analyticsPresenceCounts$: Observable<IAnalyticsPresenceCounts> = null;
  analyticsPresenceHistory$: Observable<IAnalyticsPresenceHistory[]> = null;
  analyticsPresenceUsers$: Observable<IAnalyticsPresenceUsers> = null;
  analyticsPresenceClassInfos$: Observable<IAnalyticsPresenceClassInfos> = null;

  hideHeader$ = new Subject<boolean>();
  hideHeader = false;

  doubleLineChart: Chart;
  // barChart: Chart;
  // doughnutChart: Chart;

  selectedYear = '';
  selectedMonth = '';
  selectedDay = '';
  selectedStartDate = '';
  selectedEndDate = '';

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
    private analyticsService: AnalyticsService,
    private navController: NavController,
  ) {
    this.hideHeader$.pipe(
      debounceTime(50),
      distinctUntilChanged(),
    ).subscribe((hideHeader: boolean) => this.hideHeader = hideHeader);

    const { day, month, year } = this.utilService.geLastEbdDate();
    this.selectedYear = year;
    this.selectedMonth = month;
    this.selectedDay = day;
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getAnalytics();
    // this.doubleLineChartMethod();
    // this.barChartMethod();
    // this.doughnutChartMethod();
  }

  getAnalytics() {
    this.getAnalyticsPresenceCounts();
    this.getAnalyticsPresenceHistory();
    this.getAnalyticsPresenceUsers();
    this.getAnalyticsPresenceClasses();
  }

  getAnalyticsPresenceCounts() {
    this.analyticsPresenceCounts$ = this.analyticsService.getAnalyticsPresenceCounts();
  }

  getAnalyticsPresenceHistory() {
    this.analyticsPresenceHistory$ = this.analyticsService.getAnalyticsPresenceHistory();
  }

  getAnalyticsPresenceUsers() {
    this.analyticsPresenceUsers$ = this.analyticsService.getAnalyticsPresenceUsers();
  }

  updatePresenceClasses({
    startDate,
    endDate,
    year,
    month,
    day,
  }: DateFilter) {
    this.selectedStartDate = startDate ?? '';
    this.selectedEndDate = endDate ?? '';
    this.selectedDay = day ?? '';
    this.selectedMonth = month ?? '';
    this.selectedYear = year ?? '';
    this.getAnalyticsPresenceClasses();
  }

  getAnalyticsPresenceClasses() {
    this.analyticsPresenceClassInfos$ = this.analyticsService.getAnalyticsPresenceClassInfos(
      this.selectedStartDate,
      this.selectedEndDate,
      this.selectedDay,
      this.selectedMonth,
      this.selectedYear,
    );
  }

  async logout() {
    await this.authService.logout();
    this.navController.navigateRoot('login', { replaceUrl: true });
  }

  doubleLineChartMethod() {
    // if (this.doubleLineCanvas?.nativeElement) {
    //   if (this.doubleLineChart) {
    //     this.doubleLineChart.destroy();
    //   }

    //   const randomColorsList = randomColor({
    //     count: this.classes.length,
    //     // hue: '#be1558',
    //     // hue: 'blue',
    //     // luminosity: 'light',
    //     format: 'rgba',
    //     alpha: 0.7,
    //   });

    //   this.doubleLineChart = new Chart(this.doubleLineCanvas.nativeElement, {
    //     type: 'bar',
    //     data: {
    //       labels: ['02/01', '09/01', '16/01', '23/01'],
    //       datasets: this.classes.map(({ name: label }, index) => ({
    //         label,
    //         data: [
    //           Math.round((Math.random() * 30)),
    //           Math.round((Math.random() * 30)),
    //           Math.round((Math.random() * 30)),
    //           Math.round((Math.random() * 30))
    //         ],
    //         backgroundColor: randomColorsList[index],
    //         borderColor: randomColorsList[index].replace('0.7', '1.0'),
    //         fill: false,
    //         tension: 0.3,
    //         pointRadius: 5,
    //       })),
    //     },
    //     options: {
    //       responsive: true,
    //       aspectRatio: 2.75,
    //       scales: {
    //         y: {
    //           ticks: {
    //             font: {
    //               size: 14,
    //             },
    //           }
    //         },
    //         x: {
    //           ticks: {
    //             font: {
    //               size: 14,
    //             },
    //           }
    //         },
    //       },
    //       plugins: {
    //         legend: {
    //           labels: {
    //             font: {
    //               size: 16,
    //             }
    //           }
    //         }
    //       },
    //     }
    //   });
    // }
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
