import { Component, inject, OnInit } from '@angular/core';
import { Workspace } from '../../../models/Workspace';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace-service';
import { Office } from '../../../models/Office';
import { ConferenceRoom } from '../../../models/ConferenceRoom';
import { FormsModule } from '@angular/forms';
import { UtilityService } from '../../../services/utility-service';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-update-workspace-component',
  imports: [FormsModule],
  templateUrl: './update-workspace-component.html',
  styleUrl: './update-workspace-component.css',
})
export class UpdateWorkspaceComponent implements OnInit{

  private workspaceService = inject(WorkspaceService)
  private route = inject(ActivatedRoute)
  private utilityService = inject(UtilityService)

  workspaceID = ""

  workspace: Workspace = new Workspace()

  office: Office = new Office()
  confRoom: ConferenceRoom = new ConferenceRoom()

  selectedFiles: File[] = []

  errorMessage = ""
  successMessage = ""

  ngOnInit(): void {

    this.workspaceID = this.route.snapshot.paramMap.get("workspaceID")!

    this.workspaceService.getWorkspaceDetails(this.workspaceID).subscribe(ws=>{
      this.workspace = ws
    })

  }

  addOffice(){
    if(!this.office.name || !this.office.desks) return

    this.workspace.offices.push({...this.office})
    this.office = new Office()

  }

  removeOffice(office: Office){
    let index = this.workspace.offices.indexOf(office)
    this.workspace.offices.splice(index,1)
  }

  addConfRoom(){
    if(!this.confRoom.name) 
      return

    this.workspace.confRooms.push({...this.confRoom})
    this.confRoom = new ConferenceRoom()
  }

  removeConfRoom(room: ConferenceRoom){
    let index = this.workspace.confRooms.indexOf(room)
    this.workspace.confRooms.splice(index,1)
  }

  onFilesSelected(event:any){
    this.selectedFiles = Array.from(event.target.files)
  }

  updateWorkspace(){

    const formData = new FormData()
    formData.append("workspace", JSON.stringify(this.workspace))

    this.selectedFiles.forEach(file=>{
      formData.append("photos", file)
    })

    this.workspaceService.updateWorkspace(this.workspaceID, formData).subscribe({
      next:(res:any)=>{
        this.errorMessage = ""
        this.successMessage = res.message
      },
      error:(err)=>{
        this.successMessage = ""
        this.errorMessage = err.error.message
      }
    })
  }

  removePhoto(photo:string){
    this.workspaceService.deleteWorkspacePhoto(this.workspaceID, photo).subscribe({
        next: (res: any) => {
            this.workspace.photos = res.photos; // update photos array
            this.successMessage = res.message;
        },
        error: (err) => {
            this.errorMessage = err.error.message || "Error removing photo";
        }
    });
  }

  getImageUrl(url:string){
    return this.utilityService.getImageUrl(url)
  }
}
