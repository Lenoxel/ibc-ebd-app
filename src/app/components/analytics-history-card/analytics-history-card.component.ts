/* eslint-disable no-underscore-dangle */
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import randomColor from 'randomcolor';
import { IAnalyticsPresenceHistory } from 'src/app/interfaces';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-analytics-history-card',
  templateUrl: './analytics-history-card.component.html',
  styleUrls: ['./analytics-history-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsHistoryCardComponent {
  @ViewChild('lineCanvasPresences', { static: false }) private lineCanvasPresences: ElementRef;

  chartPresences: Chart;

  private _analyticsPresenceHistory: IAnalyticsPresenceHistory[];

  constructor(
    private utilService: UtilService,
  ) { }

  @Input()
  get analyticsPresenceHistory() {
    return this._analyticsPresenceHistory;
  }
  set analyticsPresenceHistory(analyticsPresenceHistory: IAnalyticsPresenceHistory[]) {
    if (analyticsPresenceHistory) {
      this._analyticsPresenceHistory = analyticsPresenceHistory;
      this.lineChartPresencesMethod();
    }
  }

  lineChartPresencesMethod() {
    if (this.lineCanvasPresences?.nativeElement) {
      if (this.chartPresences) {
        this.chartPresences.clear();
      }

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

      this.chartPresences = new Chart(this.lineCanvasPresences.nativeElement, {
        type: 'line',
        data: {
          // ['08/05', '15/05', '22/05', '29/05', '05/06', '12/06', '19/06', '26/06']
          labels: this.analyticsPresenceHistory.map(data => this.utilService.datePipe.transform(data.lesson_date, 'dd/MM')),
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
              // [199, 208, 212, 271, 252, 287, 249, 216]
              data: this.analyticsPresenceHistory.map(data => data.presences),
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
              // [116, 97, 98, 32, 55, 17, 74, 95]
              data: this.analyticsPresenceHistory.map(data => data.absences),
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
  }
}
