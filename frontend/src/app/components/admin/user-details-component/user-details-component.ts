import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/User';
import { UtilityService } from '../../../services/utility-service';
import { Workspace } from '../../../models/Workspace';
import { WorkspaceService } from '../../../services/workspace-service';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { ReservationsService } from '../../../services/reservations-service';
import { Reservation } from '../../../models/Reservation';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-details-component',
  imports: [DatePipe, FormsModule, CommonModule],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css',
})
export class UserDetailsComponent implements OnInit{

  private route = inject(ActivatedRoute)
  private userService = inject(UserService)
  private utilityService = inject(UtilityService)
  private workspaceService = inject(WorkspaceService)
  private reservationService = inject(ReservationsService)
  private router = inject(Router)

  user:User = new User()
  workspaces:Workspace[] = []
  reservations: Reservation[] = []
  isManager = false

  successMessage = ""
  errorMessage = ""

  ngOnInit(): void {
    let username = this.route.snapshot.paramMap.get("username")
    this.userService.getUserInfo(username!).subscribe(user=>{
      this.user = user
      this.isManager = this.user.type==='manager'

      if(this.isManager){
        this.workspaceService.getManagedWorkspaces(this.user.username).subscribe(ws=>{
          this.workspaces = ws
        })
      }
      else{
        this.reservationService.getUserReservations(this.user.username).subscribe(res=>{
          this.reservations = res
        })
      }
    })
  }

  getImageUrl(photo:string){
    return this.utilityService.getImageUrl(photo)
  }

  workspaceDetails(ws:Workspace){
    this.router.navigate(['admin/workspace-details', ws._id])
  }

  editUser(){
    this.router.navigate(['admin/edit-user', this.user.username])
  }

  deleteUser(){
    if(confirm(`Are you sure you want to delete ${this.user.firstname} ${this.user.lastname}?`)){
        this.userService.deleteUser(this.user.username).subscribe({
            next: (response) => {
                this.errorMessage = ""
                this.successMessage = response.body!.message
                this.router.navigate(['admin/all-users']); 
            },
            error: (err) => {
                this.successMessage = ""
                this.errorMessage = err.err.message
            }
        });
    }
  }

}
