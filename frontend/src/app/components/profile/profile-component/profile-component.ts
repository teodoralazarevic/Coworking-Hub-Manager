import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { UserService } from '../../../services/user-service';
import { UtilityService } from '../../../services/utility-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css',
})
export class ProfileComponent implements OnInit{

  private userService = inject(UserService)
  private utilityService = inject(UtilityService)

  loggedUser: User = new User()
  newUserInfo: User = new User()
  selectedFile: File | null = null
  previewImageUrl: string | null = null
  errorMessage = ""
  successMessage = ""
  showUpdateWindow = false

  ngOnInit(): void {
    let user = localStorage.getItem("loggedIn")
    if(user)
      this.loggedUser = JSON.parse(user) 
  }

  getImageUrl(imagePath: string): string {
    return this.utilityService.getImageUrl(imagePath)
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // validation of size and type
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      this.errorMessage = "Only JPG/PNG formats are allowed";
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
        this.errorMessage = "Image must be between 100x100 and 300x300 px"
        this.selectedFile = null
      } else {
        this.errorMessage = ""
        this.selectedFile = file
        this.previewImageUrl = URL.createObjectURL(file)
      }
    };
    img.src = URL.createObjectURL(file)
  }

  updateProfile() {
    // password validation if password is changed
    if(this.newUserInfo.password){
      this.errorMessage = this.utilityService.validatePassword(this.newUserInfo.password)
      if(this.errorMessage) return
    }

    const formData = new FormData()
    formData.append('username', this.loggedUser.username)
    formData.append('password', this.newUserInfo.password)
    formData.append('firstname', this.newUserInfo.firstname)
    formData.append('lastname', this.newUserInfo.lastname)
    formData.append('contact_phone', this.newUserInfo.contact_phone)
    formData.append('email', this.newUserInfo.email)

    if(this.selectedFile) {
      formData.append('profileImage', this.selectedFile)
    }

    this.userService.updateProfileMember(formData).subscribe({
      next: (response) => {
        this.errorMessage = ""
        this.successMessage = response.body?.message!
        if(this.selectedFile) 
          this.loggedUser.profileImage = this.previewImageUrl!
          this.userService.getUserInfo(this.loggedUser.username).subscribe(user=>{
            this.loggedUser = user
            localStorage.setItem("loggedIn", JSON.stringify(this.loggedUser))
          })
      },
      error: (error) => {
        this.successMessage = ""
        this.errorMessage = error.error.message
      }
    });
  }

}
