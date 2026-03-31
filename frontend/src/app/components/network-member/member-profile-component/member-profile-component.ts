import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '../../profile/profile-component/profile-component';
import { Reservation, ReservationStatus } from '../../../models/Reservation';
import { ReservationsService } from '../../../services/reservations-service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'
import { ViewChild, AfterViewInit } from '@angular/core'
import { MatSortModule } from '@angular/material/sort'
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { UtilityService } from '../../../services/utility-service';

@Component({
  selector: 'app-member-profile-component',
  imports: [FormsModule, ProfileComponent, DatePipe, MatTableModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatSortModule,
    MatCardContent, MatCardSubtitle, MatCardTitle, MatCardHeader, MatCard, MatCardActions
  ],
  templateUrl: './member-profile-component.html',
  styleUrl: './member-profile-component.css',
})
export class MemberProfileComponent implements OnInit{

  private reservationService = inject(ReservationsService)
  private lateCancelTime = 12*60*60*1000 // 12 hours

  loggedUser: User = new User()
  previousReservations: Reservation[] = []
  activeReservations: Reservation[] = []
  
  // sorted arrays to display
  sortedActiveReservations: Reservation[] = []
  sortedPreviousReservations: Reservation[] = []
  
  // sorting for active reservations
  activeSortColumn: string = ''
  activeSortDirection: 'asc' | 'desc' = 'asc'
  
  // sorting for previous reservations
  previousSortColumn: string = ''
  previousSortDirection: 'asc' | 'desc' = 'asc'

  errorMessage = ""
  successMessage = ""

  displayedColumns: string[] = ['spaceName', 'city', 'date', 'time', 'action']

  loadData(){
    this.activeReservations = []
    this.previousReservations = []
    this.reservationService.getUserReservations(this.loggedUser.username).subscribe(reservations=>{
      reservations.forEach(r=>{
        r.date = r.startTime.split("T")[0]
        if(r.status===ReservationStatus.RESERVED)
          this.activeReservations.push(r)
        else
          this.previousReservations.push(r)
      })
      
      this.applyActiveSort()
      this.applyPreviousSort()
    })
  }

  ngOnInit(): void {
    let user = localStorage.getItem("loggedIn")
    if(user)
      this.loggedUser = JSON.parse(user)
    this.loadData()
  }

  lateForCancel(reservation:Reservation){
    const now = new Date()
    const reservationTime = new Date(reservation.startTime)
    const diffsMs = reservationTime.getTime() - now.getTime()
    return diffsMs<this.lateCancelTime
  }

  cancelReservation(reservation:Reservation){
    this.reservationService.cancelReservation(reservation).subscribe({
      next: (res)=>{
        this.errorMessage = ""
        this.successMessage = res.body?.message!
        this.loadData()
      },
      error: (err)=>{
        this.successMessage = ""
        this.errorMessage = err.error.message
      }
    })
  }
  
  // Funkcije za sortiranje aktivnih rezervacija
  sortActive(column: string) {
    if (this.activeSortColumn === column) {
      // Promeni smer sortiranja
      this.activeSortDirection = this.activeSortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      // Nova kolona za sortiranje
      this.activeSortColumn = column
      this.activeSortDirection = 'asc'
    }
    this.applyActiveSort()
  }
  
  applyActiveSort() {
    if (!this.activeSortColumn) {
      this.sortedActiveReservations = [...this.activeReservations]
      return
    }
    
    this.sortedActiveReservations = [...this.activeReservations].sort((a, b) => {
      let comparison = 0
      
      switch(this.activeSortColumn) {
        case 'date':
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          break
        case 'city':
          comparison = a.workspace.city.localeCompare(b.workspace.city)
          break
        case 'spaceName':
          comparison = a.spaceName.localeCompare(b.spaceName)
          break
      }
      
      return this.activeSortDirection === 'asc' ? comparison : -comparison
    })
  }
  
  resetActiveSort() {
    this.activeSortColumn = ''
    this.activeSortDirection = 'asc'
    this.sortedActiveReservations = [...this.activeReservations]
  }
  
  sortPrevious(column: string) {
    if (this.previousSortColumn === column) {
      this.previousSortDirection = this.previousSortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      this.previousSortColumn = column
      this.previousSortDirection = 'asc'
    }
    this.applyPreviousSort()
  }
  
  applyPreviousSort() {
    if (!this.previousSortColumn) {
      this.sortedPreviousReservations = [...this.previousReservations]
      return
    }
    
    this.sortedPreviousReservations = [...this.previousReservations].sort((a, b) => {
      let comparison = 0
      
      switch(this.previousSortColumn) {
        case 'date':
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          break
        case 'city':
          comparison = a.workspace.city.localeCompare(b.workspace.city)
          break
        case 'spaceName':
          comparison = a.spaceName.localeCompare(b.spaceName)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
      }
      
      return this.previousSortDirection === 'asc' ? comparison : -comparison
    })
  }
  
  resetPreviousSort() {
    this.previousSortColumn = ''
    this.previousSortDirection = 'asc'
    this.sortedPreviousReservations = [...this.previousReservations]
  }

  private utilityService = inject(UtilityService)

  getImageURL(url:string){
    return this.utilityService.getImageUrl(url)
  }
}