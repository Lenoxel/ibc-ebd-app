import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  IAnalyticsPresenceClassInfos,
  IAnalyticsPresenceCounts,
  IAnalyticsPresenceHistory,
  IAnalyticsPresenceUsers
} from 'src/app/interfaces';
import { UtilService } from 'src/app/services/util/util.service';
import { DateFilter, EntityBasic } from 'src/app/types';
import SwiperCore, { Autoplay, Keyboard, Pagination, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Autoplay, Keyboard, Pagination]);

@Component({
  selector: 'app-analytics-container',
  templateUrl: './analytics-container.component.html',
  styleUrls: ['./analytics-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsContainerComponent implements OnInit, AfterViewInit {
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
    speed: 500,
    autoplay: {
      disableOnInteraction: false,
      delay: 4000,
    }
  };

  swiperWorryingStudentsConfig: SwiperOptions = {
    slidesPerView: 1.0,
    pagination: true,
    keyboard: true,
    speed: 500,
    autoplay: {
      disableOnInteraction: false,
      delay: 4000,
    }
  };

  filterLabelItems = [
    {
      id: 0,
      name: 'Todos os Selos'
    },
    {
      id: 1,
      name: 'Selos Positivos'
    },
    {
      id: 2,
      name: 'Selos Negativos'
    },
  ]

  filterExemplaryStudentsLabelOptions: { items: EntityBasic[], choosedItem: EntityBasic } = {
    items: this.filterLabelItems,
    choosedItem: this.filterLabelItems[0]
  };

  filterWorryingStudentsLabelOptions: { items: EntityBasic[], choosedItem: EntityBasic } = {
    items: this.filterLabelItems,
    choosedItem: this.filterLabelItems[0]
  };

  constructor(
    public utilService: UtilService,
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.swiperExemplaryStudents.swiperRef.autoplay.running = true;
    this.swiperWorryingStudents.swiperRef.autoplay.running = true;
  }

  handleChangeDateEvent(dateFilter: DateFilter) {
    this.filterByPeriod = dateFilter?.filterByPeriod;
    this.updatePresenceClassesEvent.emit(dateFilter);
  }
}
