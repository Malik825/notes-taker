import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { SidebarComponent } from "../../sidebar/sidebar.component"; // Assuming Chart.js is installed

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './statistics-dashboard.component.html',
  styleUrls: ['./statistics-dashboard.component.scss']
})
export class StatisticsDashboardComponent implements OnInit {
  totalNotes = computed(() => this.noteService.notes().length);
  totalWords = computed(() =>
    this.noteService.notes().reduce((acc, note) => acc + (note.content?.split(/\s+/)?.length || 0), 0)
  );
  activeTags = computed(() => {
    // Placeholder logic; replace with actual tag counting if implemented
    const tags = new Set(this.noteService.notes().flatMap(note => (note as any).tags || []));
    return tags.size || 42; // Default to 42 as per image
  });
  weeklyActivity = computed(() => 87); // Placeholder; replace with actual logic
  storageUsed = computed(() => {
    // Placeholder: Estimate storage (e.g., 1.2GB out of 5GB as per image)
    return '1.2GB/5GB';
  });

  private notesChart?: Chart;
  private categoriesChart?: Chart;

  constructor(
    private noteService: NoteService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.noteService.loadNotes(user.id);
      this.initializeCharts();
    }
  }

  private initializeCharts(): void {
    // Notes Created Over Time Chart (Line Chart)
    const ctxNotes = document.getElementById('notesChart') as HTMLCanvasElement;
    if (ctxNotes && !this.notesChart) {
      this.notesChart = new Chart(ctxNotes, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Notes Created',
            data: [50, 350, 300, 250, 275, 300, 320], // Placeholder data
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      } as ChartConfiguration);
    }

    // Note Categories Chart (Doughnut Chart)
    const ctxCategories = document.getElementById('categoriesChart') as HTMLCanvasElement;
    if (ctxCategories && !this.categoriesChart) {
      this.categoriesChart = new Chart(ctxCategories, {
        type: 'doughnut',
        data: {
          labels: ['Work', 'Personal', 'Ideas', 'Research', 'Other'],
          datasets: [{
            data: [40, 25, 15, 10, 10], // Placeholder data
            backgroundColor: ['#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      } as ChartConfiguration);
    }
  }

  ngOnDestroy(): void {
    if (this.notesChart) this.notesChart.destroy();
    if (this.categoriesChart) this.categoriesChart.destroy();
  }
}