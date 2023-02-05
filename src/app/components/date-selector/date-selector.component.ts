import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilService } from 'src/app/services/util/util.service';
import { DateFilter } from 'src/app/types';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent implements OnInit {
  @Output() changeDateEvent = new EventEmitter<DateFilter>();

  @Input() filterByPeriod = false;

  selectedYear: string = null;
  selectedMonth: number = null;
  selectedDay: number = null;

  startDate: string = null;
  endDate: string = null;

  constructor(
    public utilService: UtilService,
  ) {}

  ngOnInit() {
    if (this.filterByPeriod) {
      this.initializeFilterByRangeDate();
    } else {
      this.initializeFilterBySunday();
    }
  }

  initializeFilterBySunday() {
    const { day, month, year } = this.utilService.geLastEbdDate();
    this.selectedDay = Number(day);
    this.selectedMonth = Number(month) - 1;
    this.selectedYear = year;
    this.utilService.setSundaysOnMonth(this.selectedMonth, Number(this.selectedYear));
  }

  initializeFilterByRangeDate() {
    const newDate = new Date();

    this.endDate = this.utilService.datePipe.transform(newDate, 'yyyy-MM-dd');
    this.startDate = this.utilService.datePipe.transform(new Date(newDate.getTime() - (1000 * 3600 * 24 * 30)), 'yyyy-MM-dd');
  }

  onChangeFilterToggle() {
    if (this.filterByPeriod) {
      this.initializeFilterByRangeDate();
      this.onChangeRangeDate();
    } else {
      this.initializeFilterBySunday();
      this.onChangeDay();
    }
  }

  onChangeMonth() {
    this.selectedDay = null;
    this.utilService.setSundaysOnMonth(this.selectedMonth, Number(this.selectedYear));
  }

  onChangeDay() {
    this.changeDateEvent.emit({
      filterByPeriod: this.filterByPeriod,
      year: this.selectedYear,
      month: String(this.selectedMonth + 1),
      day: String(this.selectedDay)
    });
  }

  onChangeRangeDate() {
    if (this.startDate && this.endDate) {
      this.changeDateEvent.emit({
        filterByPeriod: this.filterByPeriod,
        startDate: this.startDate,
        endDate: this.endDate,
      });
    }
  }

}
