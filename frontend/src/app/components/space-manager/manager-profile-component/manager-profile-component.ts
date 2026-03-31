import { Component, inject, OnInit } from '@angular/core';
import { ProfileComponent } from '../../profile/profile-component/profile-component';
import { User } from '../../../models/User';
import { Company } from '../../../models/Company';
import { CompanyService } from '../../../services/company-service';
import { Workspace } from '../../../models/Workspace';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { UtilityService } from '../../../services/utility-service';

@Component({
  selector: 'app-manager-profile-component',
  imports: [ProfileComponent, MatIcon],
  templateUrl: './manager-profile-component.html',
  styleUrl: './manager-profile-component.css',
})
export class ManagerProfileComponent implements OnInit{

  private companyService = inject(CompanyService)
  private utilityService = inject(UtilityService)
  private router = inject(Router)

  loggedManager:User = new User()
  company:Company = new Company()
  workspaces:Workspace[] = []

  ngOnInit(): void {
    let loggedUser = localStorage.getItem("loggedIn")
    if(!loggedUser)
      return
    this.loggedManager = JSON.parse(loggedUser)
    this.companyService.getCompany(this.loggedManager).subscribe(company=>{
      this.company = company

      this.companyService.getWorkspaces(this.company).subscribe(ws=>{
        this.workspaces = ws
      })
    })
  }

  updateWorkspace(ws:Workspace){
    this.router.navigate(['manager/update-workspace', ws._id])
  }

  getImageUrl(url:string){
    return this.utilityService.getImageUrl(url)
  }

}
