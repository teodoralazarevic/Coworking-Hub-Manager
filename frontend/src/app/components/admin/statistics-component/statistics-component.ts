// components/admin/statistics/statistics.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../../models/Reservation';
import { Workspace } from '../../../models/Workspace';
import Chart from 'chart.js/auto';
import { ReservationsService } from '../../../services/reservations-service';
import { WorkspaceService } from '../../../services/workspace-service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-component.html',
  styleUrls: ['./statistics-component.css']
})
export class StatisticsComponent implements OnInit {
  private reservationsService = inject(ReservationsService);
  private workspaceService = inject(WorkspaceService);
  
  reservations: Reservation[] = [];
  workspaces: Workspace[] = [];
  workspaceStats: any[] = [];
  
  totalReservations = 0;
  completedReservations = 0;
  activeReservations = 0;
  cancelledReservations = 0;

  private popularityChart: any;
  private revenueChart: any;

  ngOnInit() {
    this.loadWorkspaces();
  }

  loadWorkspaces() {
    this.workspaceService.getAllWorkspaces().subscribe({
      next: (workspaces) => {
        this.workspaces = workspaces.body!;
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error loading workspaces:', error);
      }
    });
  }

  loadReservations() {
    this.reservationsService.getReservations().subscribe({
      next: (data) => {
        this.reservations = data.body!;
        this.calculateBasicStats();
        this.prepareWorkspaceStats();
        this.createCharts();
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.prepareWorkspaceStats();
        this.createCharts();
      }
    });
  }

  calculateBasicStats() {
    this.totalReservations = this.reservations.length;
    this.completedReservations = this.reservations.filter(r => r.status === 'completed').length;
    this.activeReservations = this.reservations.filter(r => r.status === 'reserved').length;
    this.cancelledReservations = this.reservations.filter(r => r.status === 'cancelled').length;
  }

  prepareWorkspaceStats() {
    const statsMap = new Map<string, any>();
    
    // Add all workspaces with default values
    this.workspaces.forEach(workspace => {
      statsMap.set(workspace.workspaceName, {
        workspaceName: workspace.workspaceName,
        reservationCount: 0,
        totalHours: 0,
        revenue: 0,
        pricePerHour: workspace.pricePerHour || 0,
        _id: workspace._id
      });
    });

    // Process reservations and update counters
    this.reservations.forEach(reservation => {
      const workspaceName = reservation.workspace?.workspaceName;
      
      if (workspaceName && statsMap.has(workspaceName)) {
        const stats = statsMap.get(workspaceName);
        stats.reservationCount++;
        
        if (reservation.startTime && reservation.endTime && reservation.status=='completed') {
          const start = new Date(reservation.startTime);
          const end = new Date(reservation.endTime);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          stats.totalHours += hours;
          stats.revenue += hours * stats.pricePerHour;
        }
      } else if (workspaceName) {
        console.log('Reservation for non-existent workspace:', workspaceName);
      }
    });
    
    this.workspaceStats = Array.from(statsMap.values())
      .sort((a, b) => a.workspaceName.localeCompare(b.workspaceName));
  }

  createCharts() {
    this.createPopularityChart();
    this.createRevenueChart();
  }

  createPopularityChart() {
    const ctx = document.getElementById('popularityChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.popularityChart) {
      this.popularityChart.destroy();
    }

    const backgroundColors = this.workspaceStats.map(stat => 
      stat.reservationCount === 0 ? '#E0E0E0' : '#42A5F5'
    );

    this.popularityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.workspaceStats.map(s => s.workspaceName),
        datasets: [{
          label: 'Number of reservations',
          data: this.workspaceStats.map(s => s.reservationCount),
          backgroundColor: backgroundColors,
          borderColor: '#1E88E5',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return value === 0 ? 'No reservations' : `${value} reservations`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return value + ' res';
              }
            }
          }
        }
      }
    });
  }

  createRevenueChart() {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    const backgroundColors = this.workspaceStats.map(stat => 
      stat.revenue === 0 ? '#E0E0E0' : '#66BB6A'
    );

    this.revenueChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.workspaceStats.map(s => s.workspaceName),
        datasets: [{
          label: 'Revenue (RSD)',
          data: this.workspaceStats.map(s => s.revenue),
          backgroundColor: backgroundColors,
          borderColor: '#43A047',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return value === 0 ? 'No revenue' : `${value.toFixed(2)} RSD`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value + ' RSD';
              }
            }
          }
        }
      }
    });
  }

  hasReservations(workspaceName: string): boolean {
    const stat = this.workspaceStats.find(s => s.workspaceName === workspaceName);
    return stat ? stat.reservationCount > 0 : false;
  }

  formatHours(hours: number): string {
    if (hours === 0) return '0 hours';
    if (hours < 1) return `${(hours * 60).toFixed(0)} minutes`;
    if (hours % 1 === 0) return `${hours} hours`;
    return `${hours.toFixed(1)} hours`;
  }
}