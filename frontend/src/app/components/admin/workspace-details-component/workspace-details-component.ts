import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace-service';
import { UserService } from '../../../services/user-service';
import { ReservationsService } from '../../../services/reservations-service';
import { Workspace } from '../../../models/Workspace';
import { User } from '../../../models/User';
import { CalendarEvent, CalendarWeekViewComponent } from 'angular-calendar';
import { Comment } from '../../../models/Comment';
import { Reservation } from '../../../models/Reservation';
import { MapComponent } from '../../map/map-component/map-component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { GalleryComponent } from '../../gallery/gallery-component/gallery-component';
import { UtilityService } from '../../../services/utility-service';

@Component({
  selector: 'app-workspace-details-component',
  imports: [
    MapComponent,
    CalendarWeekViewComponent,
    CommonModule,
    FormsModule,
    MatGridListModule,
    MatDialogModule,
    GalleryComponent
  ],
  templateUrl: './workspace-details-component.html',
  styleUrl: './workspace-details-component.css',
})
export class WorkspaceDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private wsService = inject(WorkspaceService);
  private userService = inject(UserService);
  private reservationService = inject(ReservationsService);

  workspaceID = "";
  workspace: Workspace = new Workspace();
  address = "";
  allRooms: any[] = [];
  
  // Za prikaz jedne prostorije
  selectedRoomIndex: number = 0;
  currentRoomEvents: CalendarEvent[] = [];
  currentRoomReservations: Reservation[] = [];
  
  viewDate: Date = new Date();
  weekStartsOn = 1; // Monday

  comments: Comment[] = [];

  ngOnInit(): void {
    this.workspaceID = this.route.snapshot.paramMap.get("workspaceID")!;

    // Fetch workspace details
    this.wsService.getWorkspaceDetails(this.workspaceID).subscribe(ws => {
      this.workspace = ws;
      this.address = ws.address + ", " + ws.city;

      // Fetch manager info
      this.userService.getUserInfo(ws.manager).subscribe(manager => {
        this.workspace.manager = manager;
      });

      // Aggregate all rooms
      this.allRooms = [];
      if (ws.openSpace) this.allRooms.push(ws.openSpace);
      if (ws.offices?.length) this.allRooms.push(...ws.offices);
      if (ws.confRooms?.length) this.allRooms.push(...ws.confRooms);

      // Load reservations for the first room
      if (this.allRooms.length > 0) {
        this.loadReservationsForCurrentRoom();
      }
    });

    // Load last 10 comments
    this.wsService.getLastComments(this.workspaceID).subscribe(comm => {
      this.comments = comm;
    });
  }

  // Getter za trenutnu prostoriju
  get currentRoom(): any {
    return this.allRooms[this.selectedRoomIndex];
  }

  // Returns type of room for display
  roomType(room: any): string {
    if (this.workspace.openSpace === room) return 'Open space';
    if (this.workspace.offices?.includes(room)) return 'Office';
    if (this.workspace.confRooms?.includes(room)) return 'Conference room';
    return '';
  }

  // Promena prostorije kroz dropdown
  onRoomChange() {
    this.loadReservationsForCurrentRoom();
  }

  // Load reservations for current room for current week
  loadReservationsForCurrentRoom() {
    if (!this.currentRoom) return;

    const dateRange = this.getWeekDateRange();
    
    this.reservationService.getReservationsForWorkspaceAndRoom(
      this.workspaceID,
      this.currentRoom.name,
      dateRange.first,
      dateRange.last
    ).subscribe(reservations => {
      // Sačuvaj pune rezervacije za tabelu
      this.currentRoomReservations = reservations;
      
      // Kreiraj evente za kalendar
      this.currentRoomEvents = reservations.map(r => {
        return {
          start: new Date(r.startTime),
          end: new Date(r.endTime),
          title: `${r.user?.firstname || 'Unknown'} ${r.user?.lastname || ''}`,
          color: { primary: '#1e90ff', secondary: '#D1E8FF' },
          allDay: false,
          meta: r // Sačuvaj celu rezervaciju u meta polju
        } as CalendarEvent;
      });
    });
  }

  // Pomocna funkcija za dobijanje opsega nedelje
  private getWeekDateRange(): { first: Date, last: Date } {
    const first = new Date(this.viewDate);
    const day = first.getDay();
    const diff = (day + 6) % 7; // Monday = 0
    first.setDate(first.getDate() - diff);
    first.setHours(0, 0, 0, 0);

    const last = new Date(first);
    last.setDate(first.getDate() + 6);
    last.setHours(23, 59, 59, 999);

    return { first, last };
  }

  // Week navigation
  prevWeek() {
    const d = new Date(this.viewDate);
    d.setDate(d.getDate() - 7);
    this.viewDate = d;
    this.loadReservationsForCurrentRoom();
  }

  nextWeek() {
    const d = new Date(this.viewDate);
    d.setDate(d.getDate() + 7);
    this.viewDate = d;
    this.loadReservationsForCurrentRoom();
  }

  today() {
    this.viewDate = new Date();
    this.loadReservationsForCurrentRoom();
  }

  // Returns current week range string
  getWeekRange(): string {
    const { first, last } = this.getWeekDateRange();

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return `${first.toLocaleDateString('en-US', options)} - ${last.toLocaleDateString('en-US', options)}`;
  }

  private utilityService = inject(UtilityService)

  getImageUrl(url:string){
    return this.utilityService.getImageUrl(url)
  }
}