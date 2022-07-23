import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent implements OnInit {
  @Output() changeDateEvent = new EventEmitter<{
    year: string;
    month: string;
    day: string;
  }>();

  selectedYear: string = null;
  selectedMonth: number = null;
  selectedDay: number = null;

  constructor(
    public utilService: UtilService,
  ) {
    this.utilService.setSundaysOnMonth();

    const { day, month, year } = this.utilService.geLastEbdDate();
    this.selectedDay = Number(day);
    this.selectedMonth = Number(month) - 1;
    this.selectedYear = year;
  }

  ngOnInit() {}

  onChangeMonth() {
    this.selectedDay = null;
    this.utilService.setSundaysOnMonth(this.selectedMonth);
  }

  onChangeDay() {
    this.changeDateEvent.emit({
      year: this.selectedYear,
      month: String(this.selectedMonth + 1),
      day: String(this.selectedDay)
    });
  }

}
