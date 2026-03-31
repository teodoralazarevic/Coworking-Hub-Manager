import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MapComponent } from '../../map/map-component/map-component';
import { GuestHomepageComponent } from '../guest-homepage-component/guest-homepage-component';

@Component({
  selector: 'app-guest-layout-component',
  imports: [RouterOutlet, RouterLink, MatSidenavModule, MatToolbarModule, MatListModule,
    MatButtonModule, MatIconModule],
  templateUrl: './guest-layout-component.html',
  styleUrl: './guest-layout-component.css',
})
export class GuestLayoutComponent {

  private router = inject(Router)

  goHome(){
    this.router.navigate([''])
  }
}
