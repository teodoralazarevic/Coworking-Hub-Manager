import { Component, inject, OnInit } from '@angular/core';
import { Reservation, ReservationStatus } from '../../../models/Reservation';
import { User } from '../../../models/User';
import { Workspace } from '../../../models/Workspace';
import { ReservationsService } from '../../../services/reservations-service';
import { WorkspaceService } from '../../../services/workspace-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, CalendarWeekViewComponent, CalendarEventTimesChangedEvent } from 'angular-calendar';

@Component({
  selector: 'app-reservations-component',
  imports: [DatePipe, FormsModule, CalendarWeekViewComponent],
  templateUrl: './reservations-component.html',
  styleUrl: './reservations-component.css',
})
export class ReservationsComponent implements OnInit {
  private manager: User = new User();
  private reservationService = inject(ReservationsService);
  private workspaceService = inject(WorkspaceService);
  private timeToConfirm = 10 * 60 * 1000; // 10 minuts

  // table of reservations
  reservations: Reservation[] = [];

  // manager workspaces 
  workspaces: Workspace[] = [];
  selectedWorkspaceId: string | null = null;
  selectedWorkspace: Workspace | null = null;

  // selected room
  selectedRoomType: 'open' | 'office' | 'conf' | null = null;
  selectedRoom: any = null;
  availableRooms: any[] = [];

  // calendar
  viewDate: Date = new Date();
  weekStartsOn = 1; // Monday
  currentRoomEvents: CalendarEvent[] = [];
  currentRoomReservations: Reservation[] = [];

  // moving dialog
  showRescheduleDialog = false;
  selectedReservation: Reservation | null = null;
  rescheduleDate: string = '';
  rescheduleStartTime: string = '';
  rescheduleEndTime: string = '';
  availableTimeSlots: string[] = [];

  // messages
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    let user = localStorage.getItem('loggedIn');
    if (user) {
      this.manager = JSON.parse(user);
    }
    this.loadData();
    this.loadManagerWorkspaces();
  }

  loadData() {
    this.reservationService.getManagerReservations(this.manager.username).subscribe({
      next: (r) => {
        this.reservations = r;
        this.reservations.forEach(r => {
          r.date = r.startTime.split('T')[0];
        });
      },
      error: (err) => {
        this.errorMessage = 'Failed to load reservations';
        console.error(err);
      }
    });
  }

  loadManagerWorkspaces() {
    this.workspaceService.getManagedWorkspaces(this.manager.username).subscribe({
      next: (workspaces) => {
        this.workspaces = workspaces;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load workspaces';
        console.error(err);
      }
    });
  }

  timeForConfirm(r: Reservation): boolean {
    const now = new Date();
    const startTime = new Date(r.startTime);
    const diffMs = now.getTime() - startTime.getTime();
    return diffMs < this.timeToConfirm;
  }

  clientShowedUp(r: Reservation, showed: boolean) {
    this.reservationService.clientShowedUp(r._id!, showed).subscribe({
      next: () => {
        this.successMessage = showed ? 'Attendance confirmed' : 'No show recorded';
        this.loadData();
        if (this.selectedRoom) {
          this.loadReservationsForCurrentRoom();
        }
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Action failed';
        console.error(err);
      }
    });
  }

  onWorkspaceChange() {
    if (this.selectedWorkspaceId) {
      this.workspaceService.getWorkspaceDetails(this.selectedWorkspaceId).subscribe({
        next: (workspace) => {
          this.selectedWorkspace = workspace;
          this.selectedRoomType = null;
          this.selectedRoom = null;
          this.availableRooms = [];
          this.currentRoomEvents = [];
          this.currentRoomReservations = [];
        },
        error: (err) => {
          this.errorMessage = 'Failed to load workspace details';
          console.error(err);
        }
      });
    }
  }

  onRoomTypeChange() {
    if (!this.selectedWorkspace || !this.selectedRoomType) return;

    switch (this.selectedRoomType) {
      case 'open':
        this.availableRooms = this.selectedWorkspace.openSpace ? [this.selectedWorkspace.openSpace] : [];
        break;
      case 'office':
        this.availableRooms = this.selectedWorkspace.offices || [];
        break;
      case 'conf':
        this.availableRooms = this.selectedWorkspace.confRooms || [];
        break;
    }
    
    this.selectedRoom = null;
    this.currentRoomEvents = [];
    this.currentRoomReservations = [];
  }

  get selectedRoomTypeLabel(): string {
    switch (this.selectedRoomType) {
      case 'open': return 'Open Space';
      case 'office': return 'Office';
      case 'conf': return 'Conference Room';
      default: return '';
    }
  }

  onRoomChange() {
    if (this.selectedRoom) {
      this.loadReservationsForCurrentRoom();
    }
  }

  loadReservationsForCurrentRoom() {
    if (!this.selectedWorkspaceId || !this.selectedRoom) return;

    const dateRange = this.getWeekDateRange();
    
    this.reservationService.getReservationsForWorkspaceAndRoom(
      this.selectedWorkspaceId,
      this.selectedRoom.name,
      dateRange.first,
      dateRange.last
    ).subscribe({
      next: (reservations) => {
        this.currentRoomReservations = reservations;
        this.currentRoomEvents = reservations.map(r => this.reservationToEvent(r));
      },
      error: (err) => {
        this.errorMessage = 'Failed to load room reservations';
        console.error(err);
      }
    });
  }

  private reservationToEvent(reservation: Reservation): CalendarEvent {
    return {
      id: reservation._id,
      start: new Date(reservation.startTime),
      end: new Date(reservation.endTime),
      title: `${reservation.user?.firstname || 'Unknown'} ${reservation.user?.lastname || ''}`,
      color: this.getEventColor(reservation.status),
      draggable: true,
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      meta: reservation
    };
  }

  private getEventColor(status: ReservationStatus) {
    switch (status) {
      case ReservationStatus.RESERVED:
        return { primary: '#1e90ff', secondary: '#D1E8FF' };
      case ReservationStatus.CANCELLED:
        return { primary: '#dc3545', secondary: '#f8d7da' };
      case ReservationStatus.COMPLETED:
        return { primary: '#28a745', secondary: '#d4edda' };
      default:
        return { primary: '#1e90ff', secondary: '#D1E8FF' };
    }
  }

  handleEventDrag({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    const reservation = event.meta as Reservation;
    
    this.checkSlotAvailability(reservation, newStart, newEnd!).subscribe({
      next: (isAvailable) => {
        if (isAvailable) {
          this.rescheduleDate = newStart.toISOString().split('T')[0];
          this.rescheduleStartTime = newStart.toTimeString().slice(0, 5);
          this.rescheduleEndTime = newEnd!.toTimeString().slice(0, 5);
          this.selectedReservation = reservation;
          
          this.generateTimeSlots();
          
          this.showRescheduleDialog = true;
        } else {
          this.errorMessage = 'Selected time slot is not available';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      },
      error: (err) => {
        this.errorMessage = 'Error checking availability';
        console.error(err);
      }
    });
  }

  private checkSlotAvailability(reservation: Reservation, start: Date, end: Date) {
    return this.reservationService.checkRoomAvailability(
      this.selectedWorkspaceId!,
      this.selectedRoom.name,
      start.toISOString(),
      end.toISOString(),
      reservation._id
    );
  }

  handleEventClick({ event }: { event: CalendarEvent }) {
    const reservation = event.meta as Reservation;
    this.openRescheduleDialog(reservation);
  }

  openRescheduleDialog(reservation: Reservation) {
    this.selectedReservation = reservation;
    this.rescheduleDate = reservation.date;
    this.rescheduleStartTime = reservation.startTime.split('T')[1]?.slice(0, 5) || '';
    this.rescheduleEndTime = reservation.endTime.split('T')[1]?.slice(0, 5) || '';
    this.generateTimeSlots();
    this.showRescheduleDialog = true;
  }

  private generateTimeSlots() {
    this.availableTimeSlots = [];
    for (let hour = 8; hour <= 22; hour++) {
      this.availableTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      
      if (hour < 22) {
        this.availableTimeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
  }

  confirmReschedule() {
    if (!this.selectedReservation || !this.selectedWorkspaceId || !this.selectedRoom) return;

    const newStartTime = `${this.rescheduleDate}T${this.rescheduleStartTime}:00`;
    const newEndTime = `${this.rescheduleDate}T${this.rescheduleEndTime}:00`;

    this.reservationService.rescheduleReservation(
      this.selectedReservation._id!,
      newStartTime,
      newEndTime
    ).subscribe({
      next: () => {
        this.successMessage = 'Reservation moved successfully';
        this.closeDialog();
        this.loadReservationsForCurrentRoom();
        this.loadData(); 
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to move reservation';
        console.error(err);
      }
    });
  }

  confirmCancellation(reservation: Reservation) {
    if (confirm(`Are you sure you want to cancel reservation for ${reservation.user?.firstname}?`)) {
      this.reservationService.cancelReservation(reservation).subscribe({
        next: () => {
          this.successMessage = 'Reservation cancelled successfully';
          this.loadReservationsForCurrentRoom();
          this.loadData(); 
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to cancel reservation';
          console.error(err);
        }
      });
    }
  }

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

  private getWeekDateRange(): { first: Date, last: Date } {
    const first = new Date(this.viewDate);
    const day = first.getDay();
    const diff = (day + 6) % 7;
    first.setDate(first.getDate() - diff);
    first.setHours(0, 0, 0, 0);

    const last = new Date(first);
    last.setDate(first.getDate() + 6);
    last.setHours(23, 59, 59, 999);

    return { first, last };
  }

  getWeekRange(): string {
    const { first, last } = this.getWeekDateRange();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return `${first.toLocaleDateString('en-US', options)} - ${last.toLocaleDateString('en-US', options)}`;
  }

  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  closeDialog() {
    this.showRescheduleDialog = false;
    this.selectedReservation = null;
    this.rescheduleDate = '';
    this.rescheduleStartTime = '';
    this.rescheduleEndTime = '';
    this.errorMessage = '';
  }
}