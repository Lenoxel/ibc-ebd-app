import { Component, Input, OnInit } from '@angular/core';
import { IAnalyticsPresenceClass } from 'src/app/interfaces';

@Component({
  selector: 'app-analytics-class',
  templateUrl: './analytics-class.component.html',
  styleUrls: ['./analytics-class.component.scss'],
})
export class AnalyticsClassComponent implements OnInit {
  @Input() presenceClass: IAnalyticsPresenceClass = null;

  constructor() { }

  ngOnInit() {}

}
