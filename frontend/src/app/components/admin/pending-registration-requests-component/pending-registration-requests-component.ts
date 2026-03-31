import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { RegistrationRequest } from '../../../models/RegistrationRequest';
import { UtilityService } from '../../../services/utility-service';

@Component({
  selector: 'app-pending-registration-requests-component',
  imports: [],
  templateUrl: './pending-registration-requests-component.html',
  styleUrl: './pending-registration-requests-component.css',
})
export class PendingRegistrationRequestsComponent implements OnInit{

  private userService = inject(UserService)
  private utilityService = inject(UtilityService)

  // pending registration requests
  pendingRequestsMembers:RegistrationRequest[] = []
  pendingRequestsManagers:RegistrationRequest[] = []
  memberRequestsExists = false
  managerRequestExists = false
  errorMessage = ""
  successMessage = ""

  loadPendingRequests(){
    this.userService.getPendingRegistrationRequestsMembers().subscribe({
      next: (response)=>{
        if(response.body){
          this.pendingRequestsMembers = response.body
          if(this.pendingRequestsMembers.length>0)
            this.memberRequestsExists = true
        }
      },
      error: (error)=>{
        this.errorMessage = error.error.message
      }
    })

    this.userService.getPendingRegistrationRequestsManagers().subscribe({ 
      next: (response)=>{
        if(response.body)
          this.pendingRequestsManagers = response.body
          if(this.pendingRequestsManagers.length > 0)
            this.managerRequestExists = true
      },
      error: (error)=>{
        this.errorMessage = error.error.message
      }
    })
  }

  ngOnInit(): void {
    this.loadPendingRequests()
  }

  getImageUrl(imagePath: string): string {
    return this.utilityService.getImageUrl(imagePath)
  }

  approveMemberRequest(req:RegistrationRequest){
    this.userService.approveMemberRequest(req).subscribe({
      next: (response)=>{
        this.successMessage = response.body?.message!
        this.loadPendingRequests()
      },
      error: (error)=>{
        this.errorMessage = error.error.message
      }
    })
  }

  approveManagerRequest(req:RegistrationRequest){
    this.userService.approveManagerRequest(req).subscribe({
      next: (response)=>{
        this.errorMessage = ""
        this.successMessage = response.body?.message!
        this.loadPendingRequests()
      },
      error: (error)=>{
        this.successMessage = ""
        this.errorMessage = error.error.message
      }
    })
  }

  rejectRequest(req:RegistrationRequest){
    this.userService.rejectRequest(req).subscribe({
      next: (response)=>{
        this.successMessage = response.body?.message!
        this.loadPendingRequests()
      },
      error: (error)=>{
        this.errorMessage = error.error.message
      }
    })
  }
}
