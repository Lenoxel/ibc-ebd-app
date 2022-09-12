import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAnalyticsPresenceClassInfos, IAnalyticsPresenceCounts, IAnalyticsPresenceHistory } from 'src/app/interfaces';
import { DateFilter } from 'src/app/types';

@Component({
  selector: 'app-analytics-container',
  templateUrl: './analytics-container.component.html',
  styleUrls: ['./analytics-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsContainerComponent implements OnInit {
  @Input() analyticsPresenceCounts: IAnalyticsPresenceCounts = null;
  @Input() analyticsPresenceHistory: IAnalyticsPresenceHistory[] = null;
  @Input() analyticsPresenceClassInfos: IAnalyticsPresenceClassInfos = null;
  @Output() updatePresenceClassesEvent = new EventEmitter<DateFilter>();

  filterByPeriod = false;

  constructor() { }

  ngOnInit() {}

  handleChangeDateEvent(dateFilter: DateFilter) {
    this.filterByPeriod = dateFilter?.filterByPeriod;
    this.updatePresenceClassesEvent.emit(dateFilter);
  }
}
