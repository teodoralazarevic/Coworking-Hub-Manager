import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { WorkspaceService } from '../../../services/workspace-service';
import { ReservationsService } from '../../../services/reservations-service';
import { Workspace } from '../../../models/Workspace';
import { Reservation, ReservationStatus } from '../../../models/Reservation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';

interface RoomTypeSummary {
  type: string;
  roomCount: number;
  occupiedHours: number;
  totalHours: number;
  occupancyPercentage: number;
  reservationCount: number;
}

interface ReportData {
  overallOccupancy: number;
  totalWorkingHours: number;
  totalReservations: number;
  totalRooms: number;
  totalOccupiedHours: number;
  totalAvailableHours: number;
  summaryByType: RoomTypeSummary[];
}

@Component({
  selector: 'app-report-component',
  imports: [FormsModule],
  templateUrl: './report-component.html',
  styleUrl: './report-component.css',
})
export class ReportComponent implements OnInit {
  
  private workspaceService = inject(WorkspaceService);
  private reservationService = inject(ReservationsService);

  manager: User = new User();
  workspaces: Workspace[] = [];
  selectedWorkspaceId: string | null = null;
  selectedWorkspace: Workspace | null = null;
  selectedMonth: string = '';
  
  reportData: ReportData | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const user = localStorage.getItem('loggedIn');
    if (user) {
      this.manager = JSON.parse(user);
      this.loadManagerWorkspaces();
    }
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

  onWorkspaceChange() {
    if (this.selectedWorkspaceId) {
      this.workspaceService.getWorkspaceDetails(this.selectedWorkspaceId).subscribe({
        next: (workspace) => {
          this.selectedWorkspace = workspace;
          this.selectedMonth = '';
          this.reportData = null;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load workspace details';
          console.error(err);
        }
      });
    }
  }

  async loadReportData() {
    if (!this.selectedWorkspaceId || !this.selectedMonth || !this.selectedWorkspace) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const [year, month] = this.selectedMonth.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const reservations = await this.reservationService.getReservationsForWorkspaceAndRoom(
        this.selectedWorkspaceId,
        '', // empty for all rooms
        startDate,
        endDate
      ).toPromise() || [];

      // Izračunaj statistiku
      this.reportData = this.calculateReportData(reservations, this.selectedWorkspace);
      
    } catch (error) {
      this.errorMessage = 'Failed to load report data';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  private calculateReportData(reservations: Reservation[], workspace: Workspace): ReportData {
    const workingHoursPerDay = 15.5; // 8:00 - 23:00
    const daysInMonth = this.getDaysInMonth();
    const totalMonthlyHours = daysInMonth * workingHoursPerDay;

    // Grupisanje po tipovima prostorija
    const summaryByType: Map<string, RoomTypeSummary> = new Map();
    
    // Inicijalizacija tipova
    summaryByType.set('Open Space', {
      type: 'Open Space',
      roomCount: 0,
      occupiedHours: 0,
      totalHours: 0,
      occupancyPercentage: 0,
      reservationCount: 0
    });
    
    summaryByType.set('Office', {
      type: 'Office',
      roomCount: 0,
      occupiedHours: 0,
      totalHours: 0,
      occupancyPercentage: 0,
      reservationCount: 0
    });
    
    summaryByType.set('Conference Room', {
      type: 'Conference Room',
      roomCount: 0,
      occupiedHours: 0,
      totalHours: 0,
      occupancyPercentage: 0,
      reservationCount: 0
    });

    let totalRooms = 0;

    // Obrada Open Space
    if (workspace.openSpace) {
      const type = 'Open Space';
      const summary = summaryByType.get(type)!;
      summary.roomCount++;
      summary.totalHours += totalMonthlyHours;
      totalRooms++;
    }

    // Obrada Office prostorija
    if (workspace.offices?.length) {
      workspace.offices.forEach(office => {
        const type = 'Office';
        const summary = summaryByType.get(type)!;
        summary.roomCount++;
        summary.totalHours += totalMonthlyHours;
        totalRooms++;
      });
    }

    // Obrada Conference Room
    if (workspace.confRooms?.length) {
      workspace.confRooms.forEach(room => {
        const type = 'Conference Room';
        const summary = summaryByType.get(type)!;
        summary.roomCount++;
        summary.totalHours += totalMonthlyHours;
        totalRooms++;
      });
    }

    // Obrada rezervacija
    let totalReservations = 0;
    let totalOccupiedHours = 0;

    reservations.forEach(res => {
      if (res.status === ReservationStatus.CANCELLED) return;

      const duration = this.getDurationInHours(res.startTime, res.endTime);
      const roomType = this.getRoomTypeFromName(workspace, res.spaceName);
      
      if (roomType) {
        const summary = summaryByType.get(roomType);
        if (summary) {
          summary.occupiedHours += duration;
          summary.reservationCount++;
          totalOccupiedHours += duration;
          totalReservations++;
        }
      }
    });

    // Izračunavanje procenata i uklanjanje tipova bez prostorija
    summaryByType.forEach((summary, key) => {
      if (summary.roomCount === 0) {
        summaryByType.delete(key);
      } else {
        summary.occupancyPercentage = (summary.occupiedHours / summary.totalHours) * 100;
      }
    });

    const totalAvailableHours = totalRooms * totalMonthlyHours;
    const overallOccupancy = totalAvailableHours > 0 
      ? (totalOccupiedHours / totalAvailableHours) * 100 
      : 0;

    return {
      overallOccupancy,
      totalWorkingHours: totalAvailableHours,
      totalReservations,
      totalRooms,
      totalOccupiedHours,
      totalAvailableHours,
      summaryByType: Array.from(summaryByType.values())
    };
  }

  private getRoomTypeFromName(workspace: Workspace, roomName: string): string | null {
    if (workspace.openSpace?.name === roomName) return 'Open Space';
    if (workspace.offices?.some(office => office.name === roomName)) return 'Office';
    if (workspace.confRooms?.some(room => room.name === roomName)) return 'Conference Room';
    return null;
  }

  private getDurationInHours(start: string, end: string): number {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return (endTime - startTime) / (1000 * 60 * 60);
  }

  private getDaysInMonth(): number {
    const [year, month] = this.selectedMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  }

  getMonthName(): string {
    const [year, month] = this.selectedMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' });
  }

  getYear(): string {
    return this.selectedMonth.split('-')[0];
  }

  getColorByPercentage(percentage: number): string {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
  }

  generatePDF() {
    if (!this.reportData || !this.selectedWorkspace || !this.selectedMonth) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Monthly Capacity Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Workspace: ${this.selectedWorkspace.workspaceName}`, 14, 35);
    doc.text(`Address: ${this.selectedWorkspace.address}, ${this.selectedWorkspace.city}`, 14, 42);
    doc.text(`Month: ${this.getMonthName()} ${this.getYear()}`, 14, 49);
    
    doc.setFillColor(102, 126, 234);
    doc.rect(14, 55, 85, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Overall Occupancy', 19, 65);
    doc.setFontSize(16);
    doc.text(`${this.reportData.overallOccupancy.toFixed(1)}%`, 19, 75);
    
    doc.setFillColor(240, 147, 251);
    doc.rect(105, 55, 85, 25, 'F');
    doc.text('Total Reservations', 110, 65);
    doc.text(`${this.reportData.totalReservations}`, 110, 75);
    
    doc.setFillColor(79, 172, 254);
    doc.rect(14, 85, 85, 25, 'F');
    doc.text('Total Working Hours', 19, 95);
    doc.text(`${this.reportData.totalWorkingHours}`, 19, 105);
    
    doc.setFillColor(255, 193, 7);
    doc.rect(105, 85, 85, 25, 'F');
    doc.text('Total Rooms', 110, 95);
    doc.text(`${this.reportData.totalRooms}`, 110, 105);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Occupancy Summary by Room Type', 14, 135);
    
    autoTable(doc, {
      startY: 140,
      head: [['Room Type', '# Rooms', 'Occupied Hours', 'Total Hours', 'Occupancy %', 'Reservations']],
      body: this.reportData.summaryByType.map(type => [
        type.type,
        type.roomCount.toString(),
        type.occupiedHours.toFixed(1),
        type.totalHours.toString(),
        `${type.occupancyPercentage.toFixed(1)}%`,
        type.reservationCount.toString()
      ]),
      foot: [[
        'TOTAL',
        this.reportData.totalRooms.toString(),
        this.reportData.totalOccupiedHours.toFixed(1),
        this.reportData.totalAvailableHours.toString(),
        `${this.reportData.overallOccupancy.toFixed(1)}%`,
        this.reportData.totalReservations.toString()
      ]],
      theme: 'striped',
      headStyles: { fillColor: [0, 123, 255] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    doc.save(`capacity-report-${this.selectedWorkspace.workspaceName}-${this.selectedMonth}.pdf`);
  }
}