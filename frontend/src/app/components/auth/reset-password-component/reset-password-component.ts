import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user-service';
import { RegisterComponent } from '../register-component/register-component';
import { UtilityService } from '../../../services/utility-service';

@Component({
  selector: 'app-reset-password-component',
  imports: [FormsModule],
  templateUrl: './reset-password-component.html',
  styleUrl: './reset-password-component.css',
})
export class ResetPasswordComponent implements OnInit{

  private token = ""
  private route = inject(ActivatedRoute)
  private userService = inject(UserService)
  private utilityService = inject(UtilityService)

  password1 = ""
  password2 = ""
  errorMessage = ""
  successMessage = ""

  ngOnInit(): void {
    let token = this.route.snapshot.paramMap.get("token")
    if(token)
      this.token = token
  }

  changePassword(){
    if(this.password1 != this.password2){
      this.errorMessage = "Two passwords are not same"
      return
    }
    this.errorMessage = this.utilityService.validatePassword(this.password1)
    if(this.errorMessage==""){
      this.userService.resetPassword(this.password1, this.token).subscribe({
        next: (response)=>{
          this.successMessage = response.message
        },
        error: (error)=>{
          this.errorMessage = error.error.message
        }
      })
    }
  }

}
