import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  IAnalyticsPresenceClassInfos,
  IAnalyticsPresenceCounts,
  IAnalyticsPresenceHistory,
  IAnalyticsPresenceUsers
} from 'src/app/interfaces';
import { UtilService } from 'src/app/services/util/util.service';
import { DateFilter } from 'src/app/types';
import { Chart, registerables } from 'chart.js';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Autoplay, Keyboard, Pagination, SwiperOptions } from 'swiper';

SwiperCore.use([Autoplay, Keyboard, Pagination]);
Chart.register(...registerables);

@Component({
  selector: 'app-analytics-container',
  templateUrl: './analytics-container.component.html',
  styleUrls: ['./analytics-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsContainerComponent implements OnInit {
  @Input() analyticsPresenceCounts: IAnalyticsPresenceCounts = null;
  @Input() analyticsPresenceHistory: IAnalyticsPresenceHistory[] = null;
  @Input() analyticsPresenceUsers: IAnalyticsPresenceUsers = null;
  @Input() analyticsPresenceClassInfos: IAnalyticsPresenceClassInfos = null;
  @Output() updatePresenceClassesEvent = new EventEmitter<DateFilter>();

  @ViewChild('swiperExemplaryStudents', { static: true }) private swiperExemplaryStudents: SwiperComponent;
  @ViewChild('swiperWorryingStudents', { static: true }) private swiperWorryingStudents: SwiperComponent;

  filterByPeriod = false;

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

  constructor(
    public utilService: UtilService,
  ) { }

  ngOnInit() {}

  handleChangeDateEvent(dateFilter: DateFilter) {
    this.filterByPeriod = dateFilter?.filterByPeriod;
    this.updatePresenceClassesEvent.emit(dateFilter);
  }
}
