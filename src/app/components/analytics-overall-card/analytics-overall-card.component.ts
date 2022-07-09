import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IAnalyticsPresenceCounts } from 'src/app/interfaces';

@Component({
  selector: 'app-analytics-overall-card',
  templateUrl: './analytics-overall-card.component.html',
  styleUrls: ['./analytics-overall-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsOverallCardComponent implements AfterViewInit {
  @Input() analyticsPresenceCounts: IAnalyticsPresenceCounts;

  constructor() { }

  ngAfterViewInit() {}
}
