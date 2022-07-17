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

  selectedYear = String(new Date().getFullYear());
  selectedMonth = new Date().getMonth();
  selectedDay = new Date().getDate();

  constructor(
    public utilService: UtilService,
  ) {
    this.utilService.setSundaysOnMonth();
  }

  ngOnInit() {}

  onChangeDay() {
    this.changeDateEvent.emit({
      year: this.selectedYear,
      month: String(this.selectedMonth + 1),
      day: String(this.selectedDay)
    });
  }

}
