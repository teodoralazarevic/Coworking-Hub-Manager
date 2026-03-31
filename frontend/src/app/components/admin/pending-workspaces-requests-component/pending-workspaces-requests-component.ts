import { Component, inject, OnInit } from '@angular/core';
import { Workspace } from '../../../models/Workspace';
import { WorkspaceService } from '../../../services/workspace-service';
import { Office } from '../../../models/Office';
import { ConferenceRoom } from '../../../models/ConferenceRoom';
import { MatIcon } from '@angular/material/icon';
import { UtilityService } from '../../../services/utility-service';

@Component({
  selector: 'app-pending-workspaces-requests-component',
  imports: [MatIcon],
  templateUrl: './pending-workspaces-requests-component.html',
  styleUrl: './pending-workspaces-requests-component.css',
})
export class PendingWorkspacesRequestsComponent implements OnInit{
  
  private workspaceService = inject(WorkspaceService)
  private utilityService = inject(UtilityService)

  pendingWorkspaces: Workspace[] = []
  pendingWsExist = false

  errorMessage = ""
  successMessage = ""

  loadRequests(){
    this.workspaceService.getPendingWorkspaces().subscribe(ws=>{
      this.pendingWorkspaces = ws
      this.pendingWsExist = this.pendingWorkspaces.length>0
    })
  }

  ngOnInit(): void {
    this.loadRequests()
  }

  acceptWorkspace(ws:Workspace){
    this.workspaceService.acceptWorkspace(ws).subscribe({
      next: (res)=>{
        this.successMessage = res.body?.message!
        this.loadRequests()
      },
      error: (err)=>{
        this.errorMessage = err.err.message
      }
    })
  }

  rejectWorkspace(ws:Workspace){
    this.workspaceService.rejectWorkspace(ws).subscribe({
      next: (res)=>{
        this.successMessage = res.body?.message!
        this.loadRequests()
      },
      error: (err)=>{
        this.errorMessage = err.err.message
      }
    })
  }

  getImageUrl(url:string){
    return this.utilityService.getImageUrl(url)
  }

}
