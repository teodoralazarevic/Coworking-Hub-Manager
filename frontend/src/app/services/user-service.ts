import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';
import { Message } from '../models/Message';
import { Company } from '../models/Company';
import { RegistrationRequest } from '../models/RegistrationRequest';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private http = inject(HttpClient)
  private uri = "http://localhost:4000/users"

  loginPublic(username:string, password:string){
    const data = {
      username: username,
      password: password
    }
    return this.http.post<User>(`${this.uri}/login-public`, data, {observe:'response'});
  }

  loginPrivate(username:string, password:string){
    const data = {
      username: username,
      password: password
    }
    return this.http.post<User>(`${this.uri}/login-private`, data, {observe: 'response'})
  }

  register(formData:FormData){
    return this.http.post<Message>(`${this.uri}/register`, formData, {observe: 'response'})
  }

  updateProfileMember(formData:FormData){
    return this.http.post<Message>(`${this.uri}/updateProfileMember`, formData, {observe: 'response'})
  }

  getPendingRegistrationRequestsMembers(){
    return this.http.get<RegistrationRequest[]>(`${this.uri}/pendingRegistrationRequestsMember`, {observe: 'response'})
  }

  getPendingRegistrationRequestsManagers(){
    return this.http.get<RegistrationRequest[]>(`${this.uri}/pendingRegistrationRequestsManagers`, {observe: 'response'})
  }

  // approving member registration request
  approveMemberRequest(req:RegistrationRequest){
    return this.http.post<Message>(`${this.uri}/approveMemberRequest`, req, {observe: 'response'})
  }

  // approving manager registration requst
  approveManagerRequest(req:RegistrationRequest){
    return this.http.post<Message>(`${this.uri}/approveManagerRequest`, req, {observe: 'response'})
  }

  // rejecting any registration request
  rejectRequest(req:RegistrationRequest){
    return this.http.post<Message>(`${this.uri}/rejectRequest`, req, {observe:'response'})
  }

  // forgotten password
  forgotPassword(emailOrUsername:String){
    return this.http.post<Message>(`${this.uri}/forgotPassword`, {emailOrUsername: emailOrUsername}, {observe: 'response'})
  }

  // reseting password 
  resetPassword(newPassword:string, token:string){
    const data = {
      password: newPassword,
      token: token
    }
    return this.http.post<Message>(`${this.uri}/resetPassword`, data)
  }

  getUserInfo(username:string){
    console.log(username)
    const data = {
      username: username
    }
    return this.http.post<User>(`${this.uri}/getUserInfo`, data)
  }

  getAllUsers(){
    return this.http.get<User[]>(`${this.uri}/allUsers`)
  }

  deleteUser(username:string){
    const data = {
      username: username
    }
    return this.http.post<Message>(`${this.uri}/deleteUser`, data, {observe: 'response'})
  }

  updateUser(user:User){
    return this.http.post<Message>(`${this.uri}/updateUser`, user, {observe: 'response'})
  }

}
