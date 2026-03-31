import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/User';
import { Company } from '../../../models/Company';
import { UserService } from '../../../services/user-service';
import { UtilityService } from '../../../services/utility-service';

@Component({
  selector: 'app-register-component',
  imports: [FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {

  newUser:User = new User()
  company:Company = new Company()
  spaceManager = false
  errorMessage = ""
  successMessage = ""
  profileImageUrl: string = '/public/default-profile.png'; // default

  private userService = inject(UserService)
  private utilityService = inject(UtilityService)
  
  // for managers
  private validateCompanyFields(): boolean {
    if (!this.company.company_name || !this.company.company_address || 
        !this.company.reg_number || !this.company.tax_ident_number) {
      this.errorMessage = 'All company fields are required for manager registration';
      return false;
    }

    const regNumberRegex = /^\d{8}$/
    const taxNumberRegex = /^[1-9]\d{8}$/

    // Registration number validation
    if (!regNumberRegex.test(this.company.reg_number)) {
      this.errorMessage = 'Company registration number must be exactly 8 digits';
      return false;
    }

    // PIB validation
    if (!taxNumberRegex.test(this.company.tax_ident_number)) {
      this.errorMessage = 'Tax identification number must be 9 digits and cannot start with 0';
      return false;
    }
    return true;
  }

  selectedFile: File | null = null;

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
        this.errorMessage = "Image must be between 100x100 and 300x300 px";
        this.selectedFile = null;
      } else {
        this.errorMessage = "";
        this.selectedFile = file;
      }
    }
    img.src = URL.createObjectURL(file);
  }

  register(){
    this.errorMessage = this.utilityService.validatePassword(this.newUser.password)
    if(this.errorMessage!="")
      return
    if(this.spaceManager && !this.validateCompanyFields())
      return
    if(this.spaceManager)
      this.newUser.type = "manager"
    else
      this.newUser.type = "member"

    const formData = new FormData();
    formData.append('user', JSON.stringify(this.newUser));
    formData.append('company', JSON.stringify(this.company));
    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.userService.register(formData).subscribe({
      next: response => {
        this.errorMessage = "";
        this.successMessage = response.body?.message!;
      },
      error: error => {
        this.successMessage = "";
        this.errorMessage = error.error.message;
      }
    });
  }
}
