import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Workspace } from '../models/Workspace';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {

  public validatePassword(password:string):string{
      const lenRegex = /^.{8,12}$/
      const startWithLetterRegex = /^[A-Za-z]/
      const upperLetterRegex = /[A-Z]/
      const numberRegex = /[0-9]/
      const specialCharRegex = /[^A-Za-z0-9]/ // character which is not letter or num
      
      const pass = password
      if(!lenRegex.test(pass))
        return "Password must be 8-12 characters long"
      else if(!startWithLetterRegex.test(pass))
        return "Password must start with a letter"
      else if(!upperLetterRegex.test(pass))
        return "Password must contain at least one upper letter"
      else if(!numberRegex.test(pass))
        return "Password must contain at least one digit"
      else if(!specialCharRegex.test(pass))
        return "Password must contain at least one special character"
      return "" 
  }

  
  public getImageUrl(imagePath: string): string {
    if (!imagePath || imagePath === '/default-profile.png') {
        return 'default-profile.png'; // default image will be displayed
    }
    if (imagePath.startsWith('/uploads/')) {
        return `http://localhost:4000${imagePath}`; 
    }
    return imagePath;
  }
  
}
