import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/User';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-edit-user-component',
  imports: [FormsModule],
  templateUrl: './edit-user-component.html',
  styleUrl: './edit-user-component.css',
})
export class EditUserComponent implements OnInit{

  private route = inject(ActivatedRoute)
  private userService = inject(UserService)
  private router = inject(Router)

  user: User = new User()
  successMessage = ""
  errorMessage = ""

  ngOnInit(): void {
    let username = this.route.snapshot.paramMap.get("username")
    this.userService.getUserInfo(username!).subscribe({
      next: (user) => this.user = user,
      error: (err) => this.errorMessage = err.error?.message || "Error loading user"
    })
  }

  saveUser() {
    if(!this.user.firstname || !this.user.lastname || !this.user.email){
      this.errorMessage = "Firstname, lastname and email are required!"
      return
    }

    this.userService.updateUser(this.user).subscribe({
      next: (res) => {
        this.errorMessage = ""
        this.successMessage = res.body?.message!
        this.router.navigate(['admin/all-users'])
      },
      error: (err) => {
        this.successMessage = ""
        this.errorMessage = err.err.message
      }
    })
  }
}