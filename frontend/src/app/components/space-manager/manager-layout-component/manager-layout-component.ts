import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manager-layout-component',
  imports: [RouterOutlet, RouterLink, MatSidenavModule, MatToolbarModule, MatListModule,
    MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './manager-layout-component.html',
  styleUrl: './manager-layout-component.css',
})
export class ManagerLayoutComponent {

  private router = inject(Router)

  logout(){
    localStorage.removeItem("loggedIn")
    this.router.navigate([''])
  }

  goHome(){
    this.router.navigate(['manager/reservations'])
  }

}
