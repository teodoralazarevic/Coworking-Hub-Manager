import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass-component',
  imports: [FormsModule],
  templateUrl: './forgot-pass-component.html',
  styleUrl: './forgot-pass-component.css',
})
export class ForgotPassComponent {

  private userService = inject(UserService)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  email = ""
  username = ""
  errorMessage = ""
  successMessage = ""
  forgotPassword(){
    let emailOrUsername = ""
    if(this.username!="")
      emailOrUsername = this.username
    else
      emailOrUsername = this.email
    this.userService.forgotPassword(emailOrUsername).subscribe({
      next: (response)=>{
        this.errorMessage = ""
        this.successMessage = response.body?.message!
        this.router.navigate([`guest/reset-password`, response.body?.token])
      },
      error: (error)=>{
        this.successMessage = ""
        this.errorMessage = error.error.message
      }
    })
  }
}
