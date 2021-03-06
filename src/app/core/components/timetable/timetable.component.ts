import { Component, Input, OnInit } from '@angular/core';
import { DayDateService } from 'src/app/services/day-date.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  @Input() role!: string;
  weekDays!: Date[];
  currentDay: Date = new Date();

  constructor(private dayDateService: DayDateService) { }

  ngOnInit(): void {
    this.assignDays();
  }

  public assignDays(): void{
    this.weekDays = this.dayDateService.getWeekDays();
  } 
}
