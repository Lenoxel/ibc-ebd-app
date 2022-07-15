import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IAnalyticsPresenceCounts, IAnalyticsPresenceHistory } from 'src/app/interfaces';

@Component({
  selector: 'app-analytics-container',
  templateUrl: './analytics-container.component.html',
  styleUrls: ['./analytics-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsContainerComponent implements OnInit {
  @Input() analyticsPresenceCounts: IAnalyticsPresenceCounts = null;
  @Input() analyticsPresenceHistory: IAnalyticsPresenceHistory[] = null;

  constructor() { }

  ngOnInit() {}

}
