import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IAnalyticsPresenceUsers,
  IAnalyticsUsersInteractivity,
  IAnalyticsUsersPunctuality,
} from 'src/app/interfaces';
import { UtilService } from 'src/app/services/util/util.service';
import { EntityBasic } from 'src/app/types';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-analytics-student',
  templateUrl: './analytics-student.component.html',
  styleUrls: ['./analytics-student.component.scss'],
})
export class AnalyticsStudentComponent implements OnInit, AfterViewInit {
  @Input() analyticsPresenceUsers: IAnalyticsPresenceUsers = null;
  @Input() analyticsUsersPunctuality: IAnalyticsUsersPunctuality = null;
  @Input() analyticsUsersInteractivity: IAnalyticsUsersInteractivity = null;

  @ViewChild('swiperExemplaryStudents', { static: true })
  private swiperExemplaryStudents: SwiperComponent;
  @ViewChild('swiperWorryingStudents', { static: true })
  private swiperWorryingStudents: SwiperComponent;

  @ViewChild('swiperPunctualStudents', { static: true })
  private swiperPunctualStudents: SwiperComponent;
  @ViewChild('swiperInteractiveStudents', { static: true })
  private swiperInteractiveStudents: SwiperComponent;

  private defaultSwiperConfig: SwiperOptions = {
    slidesPerView: 1.0,
    pagination: true,
    keyboard: true,
    speed: 500,
    autoplay: {
      disableOnInteraction: false,
      delay: 6000,
    },
  };

  swiperExemplaryStudentsConfig: SwiperOptions = {
    ...this.defaultSwiperConfig,
  };

  swiperWorryingStudentsConfig: SwiperOptions = {
    ...this.defaultSwiperConfig,
  };

  filterLabelItems = [
    {
      id: 0,
      name: 'Todos os Selos',
    },
    {
      id: 1,
      name: 'Selos Positivos',
    },
    {
      id: 2,
      name: 'Selos Negativos',
    },
  ];

  filterExemplaryStudentsLabelOptions: {
    items: EntityBasic[];
    chosenItem: EntityBasic;
  } = {
    items: this.filterLabelItems,
    chosenItem: this.filterLabelItems[0],
  };

  filterWorryingStudentsLabelOptions: {
    items: EntityBasic[];
    chosenItem: EntityBasic;
  } = {
    items: this.filterLabelItems,
    chosenItem: this.filterLabelItems[0],
  };

  swiperPunctualStudentsConfig: SwiperOptions = {
    ...this.defaultSwiperConfig,
    autoplay: {
      disableOnInteraction: false,
      delay: 5000,
    },
  };

  swiperInteractiveStudentsConfig: SwiperOptions = {
    ...this.defaultSwiperConfig,
    autoplay: {
      disableOnInteraction: false,
      delay: 5000,
    },
  };

  selectedYearForStudentsAnalytics: string = `${new Date().getFullYear()}`;
  onlyCurrentYearList = [this.selectedYearForStudentsAnalytics];

  constructor(public utilService: UtilService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.swiperExemplaryStudents.swiperRef.autoplay.running = true;
    this.swiperWorryingStudents.swiperRef.autoplay.running = true;
    this.swiperPunctualStudents.swiperRef.autoplay.running = true;
    this.swiperInteractiveStudents.swiperRef.autoplay.running = true;
  }
}
