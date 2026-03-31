import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Workspace } from '../../../models/Workspace';
import { Office } from '../../../models/Office';
import { ConferenceRoom } from '../../../models/ConferenceRoom';
import { WorkspaceService } from '../../../services/workspace-service';
import { Company } from '../../../models/Company';
import { User } from '../../../models/User';
import { CompanyService } from '../../../services/company-service';

@Component({
  selector: 'app-manage-workspace-component',
  imports: [FormsModule],
  templateUrl: './manage-workspace-component.html',
  styleUrl: './manage-workspace-component.css',
})


export class ManageWorkspaceComponent implements OnInit{

  private workspaceService = inject(WorkspaceService)
  private companyService = inject(CompanyService)
  
  newWorkspace: Workspace = new Workspace()
  office: Office = new Office()
  confRoom: ConferenceRoom = new ConferenceRoom()
  company: Company = new Company()

  errorMessage = ""
  successMessage = ""

  ngOnInit(): void {
    let manager = localStorage.getItem("loggedIn")
    if(manager){
      let managerUser:User = new User()
      managerUser = JSON.parse(manager)

      this.companyService.getCompany(managerUser).subscribe(company=>{
        if(company)
          this.company = company
        this.newWorkspace.company = this.company
        this.newWorkspace.manager = managerUser
      })
    }
  }

  addOffice(){
    let newOffice = new Office()
    newOffice.name = this.office.name
    newOffice.desks = this.office.desks
    // newOffice.approved = false
    this.newWorkspace.offices.push(newOffice)
    this.office.desks = 0
    this.office.name = ""
  }

  addConfRoom(){
    let newConfRoom = new ConferenceRoom()
    newConfRoom.name = this.confRoom.name
    newConfRoom.equipment = this.confRoom.equipment
    // newConfRoom.approved = false
    this.newWorkspace.confRooms.push(newConfRoom)
    this.confRoom.equipment = ""
    this.confRoom.name = ""
  }

  addWorkspace(){
    this.newWorkspace.openSpace.name = this.newWorkspace.workspaceName+" - open space"
    this.newWorkspace.approved = false
    this.newWorkspace.commentsCount = 0
    this.newWorkspace.likesCount = 0
    this.newWorkspace.dislikeCount = 0

    const formData = new FormData()
    formData.append('workspace', JSON.stringify(this.newWorkspace))

    this.selectedFiles.forEach(file => {
      formData.append('photos', file);
    })

    this.workspaceService.addWorkspace(formData).subscribe({
      next: (response) => {
        this.errorMessage = "";
        this.successMessage = response.body?.message!;
        this.newWorkspace.offices = [];
        this.newWorkspace.confRooms = [];
        this.selectedFiles = [];
      },
      error: (error) => {
        this.successMessage = "";
        this.errorMessage = error.error.message;
        this.newWorkspace.offices = [];
        this.newWorkspace.confRooms = [];
        this.selectedFiles = [];
      }
    })

    // this.workspaceService.addWorkspace(this.newWorkspace).subscribe({
    //   next: (response)=>{
    //     this.errorMessage = ""
    //     this.successMessage = response.body?.message!
    //     this.newWorkspace.offices = []
    //     this.newWorkspace.confRooms = []
    //   },
    //   error: (error)=>{
    //     this.successMessage = ""
    //     this.errorMessage = error.error.message
    //     this.newWorkspace.offices = []
    //     this.newWorkspace.confRooms = []
    //   }
    // })
  }

  selectedFiles: File[] = [];

onFilesSelected(event: any) {
  this.selectedFiles = Array.from(event.target.files);
}

}
