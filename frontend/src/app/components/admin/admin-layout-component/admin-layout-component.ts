import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout-component',
  imports: [RouterOutlet, RouterLink, MatSidenavModule, MatToolbarModule, MatListModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './admin-layout-component.html',
  styleUrl: './admin-layout-component.css',
})
export class AdminLayoutComponent {
  
  private router = inject(Router)

  logout(){
    localStorage.removeItem("loggedIn")
    this.router.navigate([''])
  }

  goHome(){
    this.router.navigate([''])
  }
}
