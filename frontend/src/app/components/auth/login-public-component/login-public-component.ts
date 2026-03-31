import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user-service';

@Component({
  selector: 'app-login-public-component',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-public-component.html',
  styleUrl: './login-public-component.css',
})
export class LoginPublicComponent {

  username = ""
  password = ""
  message = ""

  private userService = inject(UserService)
  private router = inject(Router)

  login(){
    this.userService.loginPublic(this.username, this.password).subscribe({
      
      next: (response)=>{
        const status = response.status
        const user = response.body
        localStorage.setItem("loggedIn", JSON.stringify(user))
        if(user!.type=="member"){
          this.router.navigate(['member'])
        }
        else{
          this.router.navigate(['manager'])
        }
      },

      error: (error)=>{
        this.message = error.error.message
      }
    })
  }
}
