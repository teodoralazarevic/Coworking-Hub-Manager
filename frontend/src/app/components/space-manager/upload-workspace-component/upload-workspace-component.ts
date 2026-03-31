import { Component, inject, OnInit } from '@angular/core';
import { WorkspaceService } from '../../../services/workspace-service';
import { User } from '../../../models/User';

@Component({
  selector: 'app-upload-workspace-component',
  imports: [],
  templateUrl: './upload-workspace-component.html',
  styleUrl: './upload-workspace-component.css',
})
export class UploadWorkspaceComponent implements OnInit{

  private workspaceService = inject(WorkspaceService)
  
  selectedFile = null
  filePreview: string | null = null
  errorMessage = ""
  successMessage = ""
  manager : User = new User()

  ngOnInit(): void {
    let user = localStorage.getItem("loggedIn")
    if(user){
      this.manager = JSON.parse(user)
    }
  }

  onFileSelected(event:any){
    if(event.target.files.length > 0){
      this.selectedFile = event.target.files[0]

      const reader = new FileReader()
      reader.onload = (e:any)=>{
        const json = JSON.parse(e.target.result)
        this.filePreview = JSON.stringify(json, null, 2)
      }

      reader.readAsText(this.selectedFile!)
    }
  }

  uploadWorkspaceFile(){
    if(!this.selectedFile)
      return

    const reader = new FileReader()
    reader.onload = (e:any)=>{
      const workspaceData = JSON.parse(e.target.result)
      workspaceData.manager = this.manager
      workspaceData.commentsCount = 0
      workspaceData.likesCount = 0
      workspaceData.dislikeCount = 0
      this.workspaceService.addWorkspaceJSON(workspaceData).subscribe({
        next: (response)=>{
          this.errorMessage = ""
          this.successMessage = response.body?.message!

          this.selectedFile = null
          this.filePreview = null
        },
        error: (err)=>{
          this.successMessage = ""
          this.errorMessage = err.error.message
        }
      })
    }
    reader.readAsText(this.selectedFile)
  }

}
