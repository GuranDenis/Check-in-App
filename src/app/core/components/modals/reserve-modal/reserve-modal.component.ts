import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Disciplinedto } from 'src/app/models/disciplinedto';
import { ReservationRequest } from 'src/app/models/reservationRequest';
import { User } from 'src/app/models/user';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reserve-modal',
  templateUrl: './reserve-modal.component.html',
  styleUrls: ['./reserve-modal.component.scss']
})
export class ReserveModalComponent implements OnInit {

  @Input() discipline!: Disciplinedto;
  students!: User[];

  constructor(public modal: NgbActiveModal, private formBuilder: FormBuilder, private modalService: NgbModal, private reservationService: ReservationService, private userService: UserService, private dataTransferService: DataTransferService) { }

  reservationForm = this.formBuilder.group({
    studentId: [''],
    scheduleId: ['']
  })

  ngOnInit(): void {
    this.getStudents();
  }

  public onReserve(reservationForm : FormGroup): void {
    reservationForm.patchValue({
      scheduleId: this.discipline.scheduleId.toString()
    })
    this.modalService.dismissAll();
    this.reservationService.addReservation(reservationForm.value).subscribe({
      next: _ => {
        this.updateTimetableDay();
        reservationForm.reset();
      },
      error: _ => {
        alert('Reservation already added');
        reservationForm.reset();
      }
    });
  }

  public onCancelReservation(reservationForm : FormGroup): void {
    reservationForm.patchValue({
      scheduleId: this.discipline.scheduleId.toString()
    })
    console.log(reservationForm.value)
    this.modalService.dismissAll();
    this.reservationService.deleteReservation(reservationForm.value).subscribe({
      next: _ => {
        this.updateTimetableDay();
        reservationForm.reset();
      },
      error: _ => {
        alert('Reservation does not exist');
        reservationForm.reset();
      }
    });
  }

  updateTimetableDay(): void{
    this.dataTransferService.sendUpdate('Reservation added');
  }

  public getStudents(): void{
    this.userService.getStudents().subscribe({
      next: (response: User[]) => {
        this.students = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

}
