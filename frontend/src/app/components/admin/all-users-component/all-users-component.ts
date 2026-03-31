import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { UserService } from '../../../services/user-service';
import { UtilityService } from '../../../services/utility-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-users-component',
  imports: [],
  templateUrl: './all-users-component.html',
  styleUrl: './all-users-component.css',
})
export class AllUsersComponent implements OnInit{

  private userService = inject(UserService)
  private utilityService = inject(UtilityService)
  private router = inject(Router)

  allUsers:User[] = []

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(users=>{
      this.allUsers = users
    })
  }

  goToProfile(username:string){
    this.router.navigate(['admin/user-details', username])
  }

  getImageUrl(imagePath: string): string {
    return this.utilityService.getImageUrl(imagePath)
  }

}
