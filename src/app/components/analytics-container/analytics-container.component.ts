import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  IAnalyticsPresenceClassInfos,
  IAnalyticsPresenceCounts,
  IAnalyticsPresenceHistory,
  IAnalyticsPresenceUsers,
  IAnalyticsUsersInteractivity,
  IAnalyticsUsersPunctuality,
} from 'src/app/interfaces';
import { UtilService } from 'src/app/services/util/util.service';
import { DateFilter } from 'src/app/types';
import SwiperCore, { Autoplay, Keyboard, Pagination } from 'swiper';

SwiperCore.use([Autoplay, Keyboard, Pagination]);

@Component({
  selector: 'analytics-container',
  templateUrl: './analytics-container.component.html',
  styleUrls: ['./analytics-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsContainerComponent implements OnInit {
  @Input() analyticsPresenceCounts: IAnalyticsPresenceCounts = null;
  @Input() analyticsPresenceHistory: IAnalyticsPresenceHistory[] = null;
  @Input() analyticsPresenceUsers: IAnalyticsPresenceUsers = null;
  @Input() analyticsUsersPunctuality: IAnalyticsUsersPunctuality = null;
  @Input() analyticsUsersInteractivity: IAnalyticsUsersInteractivity = null;
  @Input() analyticsPresenceClassInfos: IAnalyticsPresenceClassInfos = null;
  @Output() updatePresenceClassesEvent = new EventEmitter<DateFilter>();

  filterByPeriod = false;

  constructor(public utilService: UtilService) {}

  handleChangeDateEvent(dateFilter: DateFilter) {
    this.filterByPeriod = dateFilter?.filterByPeriod;
    this.updatePresenceClassesEvent.emit(dateFilter);
  }

  ngOnInit(): void {}
}
