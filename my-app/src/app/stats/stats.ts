import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { EmployeeService } from '../services/employee.service';
import { DeptStats } from '../models/dept-stats.model';

const PALETTE = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444', '#eab308'];

@Component({
  selector: 'app-stats',
  imports: [CommonModule, RouterLink, CardModule, ChartModule, TagModule, SkeletonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class StatsComponent implements OnInit {
  stats = signal<DeptStats[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  totalEmployees = computed(() => this.stats().reduce((s, d) => s + d.headcount, 0));
  totalPayroll = computed(() => this.stats().reduce((s, d) => s + d.totalSalary, 0));

  headcountChartData = computed(() => ({
    labels: this.stats().map(s => s.department),
    datasets: [{
      label: 'Headcount',
      data: this.stats().map(s => s.headcount),
      backgroundColor: this.stats().map((_, i) => PALETTE[i % PALETTE.length]),
      borderRadius: 6,
      borderSkipped: false
    }]
  }));

  payrollChartData = computed(() => ({
    labels: this.stats().map(s => s.department),
    datasets: [{
      label: 'Total Payroll ($)',
      data: this.stats().map(s => s.totalSalary),
      backgroundColor: this.stats().map((_, i) => PALETTE[i % PALETTE.length] + 'cc'),
      borderRadius: 6,
      borderSkipped: false
    }]
  }));

  avgSalaryChartData = computed(() => ({
    labels: this.stats().map(s => s.department),
    datasets: [
      {
        label: 'Min Salary',
        data: this.stats().map(s => s.minSalary),
        backgroundColor: '#bfdbfe',
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Avg Salary',
        data: this.stats().map(s => s.avgSalary),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Max Salary',
        data: this.stats().map(s => s.maxSalary),
        backgroundColor: '#1d4ed8',
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  }));

  pieChartData = computed(() => ({
    labels: this.stats().map(s => s.department),
    datasets: [{
      data: this.stats().map(s => s.headcount),
      backgroundColor: this.stats().map((_, i) => PALETTE[i % PALETTE.length]),
      hoverOffset: 8
    }]
  }));

  barOptions = {
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  stackedBarOptions = {
    plugins: { legend: { position: 'top' as const } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  pieOptions = {
    plugins: { legend: { position: 'right' as const } }
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getDeptStats().subscribe({
      next: (data) => { this.stats.set(data); this.loading.set(false); },
      error: () => {
        this.errorMessage.set('Could not load stats. Is Spring Boot running on port 8080?');
        this.loading.set(false);
      }
    });
  }

  deptColor(i: number): string {
    return PALETTE[i % PALETTE.length];
  }
}
