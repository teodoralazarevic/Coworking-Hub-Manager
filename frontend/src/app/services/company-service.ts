import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';
import { Message } from '../models/Message';
import { Company } from '../models/Company';
import { Workspace } from '../models/Workspace';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  
  private http = inject(HttpClient)
  private uri = "http://localhost:4000/companies"

  // get company which manager is manager
  getCompany(manager:User){
    const data = {
      manager: manager.username
    }
    return this.http.post<Company>(`${this.uri}/getCompany`, data)
  }

  // get workspaces of company
  getWorkspaces(company:Company){
    return this.http.post<Workspace[]>(`${this.uri}/getWorkspaces`, company)
  }

}
