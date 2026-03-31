import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-private-component',
  imports: [FormsModule],
  templateUrl: './login-private-component.html',
  styleUrl: './login-private-component.css',
})
export class LoginPrivateComponent {
  username = ""
  password = ""
  message = ""

  private userService = inject(UserService)
  private router = inject(Router)

  login(){
    this.userService.loginPrivate(this.username, this.password).subscribe({
      
      next: (response)=>{
        const status = response.status
        const user = response.body
        localStorage.setItem("loggedIn", JSON.stringify(user))
        this.router.navigate(['admin'])
      },

      error: (error)=>{
        this.message = error.error.message
      }
    })
  }
}
