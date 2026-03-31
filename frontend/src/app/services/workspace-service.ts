import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Workspace } from '../models/Workspace';
import { Message } from '../models/Message';
import { WorkspaceReaction } from '../models/WorkspaceReaction';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {

  private http = inject(HttpClient)
  private uri = "http://localhost:4000/workspaces"

  addWorkspaceJSON(workspace:Workspace){
    return this.http.post<Message>(`${this.uri}/addWorkspaceJSON`, workspace, {observe: 'response'})
  }

  addWorkspace(formData: FormData) {
    return this.http.post<Message>(`${this.uri}/addWorkspace`, formData, {observe: 'response'});
  }

  updateWorkspace(workspaceID: string, formData: FormData){
    formData.append("workspaceID", workspaceID)
    return this.http.post<Message>(`${this.uri}/updateWorkspace`, formData)
  }

  deleteWorkspacePhoto(workspaceID: string, photo:string){
    const data = {
      workspaceID: workspaceID,
      photo: photo
    }
    return this.http.post<Message>(`${this.uri}/deleteWorkspacePhoto`, data)
  }

  getPendingWorkspaces(){
    return this.http.get<Workspace[]>(`${this.uri}/getPendingWorkspaces`)
  }

  acceptWorkspace(workspace:Workspace){
    return this.http.post<Message>(`${this.uri}/acceptWorkspace`, workspace, {observe: 'response'})
  }

  rejectWorkspace(workspace:Workspace){
    return this.http.post<Message>(`${this.uri}/rejectWorkspace`, workspace, {observe: 'response'})
  }

  searchGuest(name:string, cities:string[]){
    const data = {
      name: name,
      cities: cities
    }
    return this.http.post<Workspace>(`${this.uri}/searchGuest`, data)
  }

  searchMember(name:string, cities:string[], selectedType:string, officeCapacity:number | null){
    const data = {
      name: name,
      cities: cities,
      selectedType: selectedType,
      officeCapacity: officeCapacity
    }
    return this.http.post<Workspace>(`${this.uri}/searchMember`, data)
  }

  getCities(){
    return this.http.get<string[]>(`${this.uri}/getCities`)
  }

  lastSearchResults: any = null
  lastSearchParams: any = {
    name: "",
    cities: [],
    selectedType: "",
    officeCapacity:null
  }

  getWorkspaceDetails(workspaceID: string){
    const data = {
      workspaceID: workspaceID
    }
    return this.http.post<any>(`${this.uri}/getWorkspaceDetails`, data)
  }

  userCanLike(workspaceID: string, username: string){
    const data = {
      workspaceID: workspaceID,
      username: username
    }
    return this.http.post<boolean>(`${this.uri}/userCanLike`, data)
  }

  userCanComment(workspaceID: string, username: string){
    const data = {
      workspaceID: workspaceID,
      username: username
    }
    return this.http.post<boolean>(`${this.uri}/userCanComment`, data)
  }

  react(reaction: WorkspaceReaction){
    return this.http.post<Message>(`${this.uri}/react`, reaction, {observe: 'response'})
  }

  leaveComment(comment: Comment){
    console.log(comment)
    return this.http.post<Message>(`${this.uri}/leaveComment`, comment, {observe: 'response'})
  }

  // get last 10 comments for workspace
  getLastComments(workspaceID: string){
    const data = {
      workspaceID: workspaceID
    }
    return this.http.post<Comment[]>(`${this.uri}/getLastComments`, data)
  }

  top5Workspaces(){
    return this.http.get<Workspace[]>(`${this.uri}/top5Workspaces`)
  }

  totalWorkspaceCount(){
    return this.http.get<number>(`${this.uri}/totalWorkspaceCount`)
  }

  getManagedWorkspaces(manager: string){
    const data = {
      manager: manager
    }
    return this.http.post<Workspace[]>(`${this.uri}/getManagedWorkspaces`, data)
  }

  getAllWorkspaces(){
    return this.http.get<Workspace[]>(`${this.uri}/getAllWorkspaces`, {observe: 'response'})
  }

}
