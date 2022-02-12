import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UtilService } from 'src/app/services/util/util.service';
import randomColor from 'randomcolor';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavController } from '@ionic/angular';

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

  lineChartPresences: Chart;
  lineChartAbsences: Chart;
  doubleLineChart: any;
  // barChart: Chart;
  // doughnutChart: Chart;

  classes = [
    {
      name: 'Novo Viver',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Gideão',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Adriel',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Ouro de Ofir',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'El Shaday',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Sabaot',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Emanuel',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Ágape',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Peniel',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Judá',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Doxa',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Maternal',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Jardim',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Primários',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
    {
      name: 'Juniores',
      enrolled: 27,
      absents: 8,
      presents: 19,
    },
  ];

  sundaysOfMonth = ['Todos os domingos de Janeiro (média)', '09 de Janeiro', '16 de Janeiro', '23 de Janeiro', '30 de Janeiro'];

  selectedYear = String(new Date().getFullYear());
  selectedMonth = new Date().getMonth();
  selectedSunday = 'Todos os domingos de Janeiro (média)';

  exemplaryStudents = [
    {
      name: 'Doninho',
      picture: '',
      infos: [
        'Pontual',
        'Presente nos últimos 36 domingos',
      ],
    },
    {
      name: 'Gabriel Lenon',
      picture: 'https://res.cloudinary.com/dps5k8b3f/image/upload/v1630780319/imnhaqy1ob8ugwcdqpyw.jpg',
      infos: [
        'Participativo',
        'Presente nos últimos 13 domingos',
      ],
    },
    {
      name: 'Rebeka Beatriz',
      picture: '',
      infos: [
        'Pontual',
        'Presente nos últimos 7 domingos',
      ],
    },
  ];

  worryingStudents = [
    {
      name: 'Wesney',
      picture: '',
      infos: [
        'Chega sempre atrasado',
        'Ausente nos últimos 11 domingos',
      ],
    },
    {
      name: 'Alysson',
      picture: '',
      infos: [
        'Chega sempre atrasado',
        'Ausente nos últimos 6 domingos',
      ],
    },
    {
      name: 'Carol',
      picture: '',
      infos: [
        'Não justifica as faltas',
        'Ausente nos últimos 37 domingos',
      ],
    },
  ];

  constructor(
    public utilService: UtilService,
    private authService: AuthService,
    private navController: NavController,
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.lineChartPresencesMethod();
    this.doubleLineChartMethod();
    // this.barChartMethod();
    // this.doughnutChartMethod();
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
        labels: ['12/12', '19/12', '26/12', '02/01', '09/01', '16/01', '23/01'],
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
            data: [199, 208, 212, 271, 252, 287, 249],
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
            data: [116, 97, 98, 32, 55, 17, 74],
            spanGaps: false,
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 3.0,
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
        // title: {
        //   display: true,
        //   position: 'top',
        //   text: 'Facebook to Instagram - Social Networking',
        //   fontSize: 12,
        //   fontColor: '#666'
        // },
        // legend: {
        //   display: true,
        //   position: 'bottom',
        //   labels: {
        //     fontColor: '#999',
        //     fontSize: 14
        //   }
        // }
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
