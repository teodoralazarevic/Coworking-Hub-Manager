import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MemberProfileComponent } from '../member-profile-component/member-profile-component';

@Component({
  selector: 'app-member-layout-component',
  imports: [RouterOutlet, RouterLink, MatSidenavModule, MatToolbarModule, MatListModule,
    MatButtonModule, MatIconModule],
  templateUrl: './member-layout-component.html',
  styleUrl: './member-layout-component.css',
})
export class MemberLayoutComponent {

  private router = inject(Router)

  logout(){
    localStorage.removeItem("loggedIn")
    this.router.navigate([''])
  }

  goHome(){
    this.router.navigate(['member'])
  }

}
