import { Component, inject, OnInit } from '@angular/core';
import { Workspace } from '../../../models/Workspace';
import { WorkspaceService } from '../../../services/workspace-service';

@Component({
  selector: 'app-guest-homepage-component',
  imports: [],
  templateUrl: './guest-homepage-component.html',
  styleUrl: './guest-homepage-component.css',
})
export class GuestHomepageComponent implements OnInit{

  private workspaceService = inject(WorkspaceService)

  top5Workspaces: Workspace[] = []
  totalWorkspaceCnt = 0

  ngOnInit(): void {
    this.workspaceService.top5Workspaces().subscribe(ws=>{
      this.top5Workspaces = ws
    })

    this.workspaceService.totalWorkspaceCount().subscribe(num=>{
      this.totalWorkspaceCnt = num
    })
  }

}
