import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';

import { PensionService } from '../services/pension.service';
import { RetiredTeacher, PensionStatus } from '../models/retired-teacher.model';

@Component({
  selector: 'app-pension',
  imports: [
    CommonModule, FormsModule, RouterLink,
    TableModule, ButtonModule, InputTextModule, SelectModule,
    DialogModule, TagModule, ToastModule, CardModule,
    IconFieldModule, InputIconModule, DividerModule
  ],
  providers: [MessageService],
  templateUrl: './pension.html',
  styleUrl: './pension.css'
})
export class PensionComponent implements OnInit {
  teachers = signal<RetiredTeacher[]>([]);
  searchTerm = signal('');
  statusFilter = signal<PensionStatus | null>(null);
  showColaModal = signal(false);
  colaPercent = signal(2.5);

  viewMode = signal<'manager' | 'login' | 'portal'>('manager');
  portalTeacherId = signal('');
  portalTeacher = signal<RetiredTeacher | null>(null);
  loginError = signal('');
  readonly currentYear = new Date().getFullYear();

  statusOptions = [
    { label: 'Active',    value: 'ACTIVE' as PensionStatus },
    { label: 'Suspended', value: 'SUSPENDED' as PensionStatus },
    { label: 'Deceased',  value: 'DECEASED' as PensionStatus },
  ];

  rowStatusOptions = [
    { label: 'Active',    value: 'ACTIVE' as PensionStatus },
    { label: 'Suspended', value: 'SUSPENDED' as PensionStatus },
    { label: 'Deceased',  value: 'DECEASED' as PensionStatus },
  ];

  filteredTeachers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    return this.teachers().filter(t => {
      const matchesSearch = !term ||
        t.firstName.toLowerCase().includes(term) ||
        t.lastName.toLowerCase().includes(term) ||
        t.teacherId.toLowerCase().includes(term);
      const matchesStatus = !status || t.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  totalRetirees  = computed(() => this.teachers().length);
  activeCount    = computed(() => this.teachers().filter(t => t.status === 'ACTIVE').length);
  suspendedCount = computed(() => this.teachers().filter(t => t.status === 'SUSPENDED').length);
  totalPayout    = computed(() =>
    this.teachers().filter(t => t.status === 'ACTIVE').reduce((sum, t) => sum + (t.monthlyPension ?? 0), 0)
  );
  avgPension     = computed(() =>
    this.activeCount() > 0 ? this.totalPayout() / this.activeCount() : 0
  );
  maxPension     = computed(() =>
    Math.max(...this.teachers().map(t => t.monthlyPension ?? 0), 1)
  );

  constructor(
    private pensionService: PensionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.pensionService.getAll().subscribe({
      next: (data) => this.teachers.set(data),
      error: () => this.showError('Could not reach the server. Is Spring Boot running on port 8080?')
    });
  }

  openColaModal(): void {
    this.colaPercent.set(2.5);
    this.showColaModal.set(true);
  }

  submitCola(): void {
    const pct = this.colaPercent();
    if (pct <= 0) return;
    this.pensionService.applyCola(pct).subscribe({
      next: (updated) => {
        this.teachers.update(list => list.map(t => updated.find(u => u.id === t.id) ?? t));
        this.showColaModal.set(false);
        this.showSuccess(`${pct}% COLA applied to ${updated.length} active pensioner${updated.length !== 1 ? 's' : ''}.`);
      },
      error: () => this.showError('Failed to apply COLA.')
    });
  }

  changeStatus(teacher: RetiredTeacher, status: PensionStatus): void {
    this.pensionService.updateStatus(teacher.id!, status).subscribe({
      next: (updated) => {
        this.teachers.update(list => list.map(t => t.id === updated.id ? updated : t));
        this.showSuccess(`${teacher.firstName} ${teacher.lastName} status updated to ${status}.`);
      },
      error: () => this.showError('Failed to update status.')
    });
  }

  pensionBarPct(pension: number): number {
    return Math.round((pension / this.maxPension()) * 100);
  }

  statusSeverity(status: PensionStatus): 'success' | 'warn' | 'secondary' {
    if (status === 'ACTIVE')    return 'success';
    if (status === 'SUSPENDED') return 'warn';
    return 'secondary';
  }

  subjectSeverity(subject: string): 'success' | 'info' | 'warn' | 'secondary' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'secondary'> = {
      'Mathematics': 'info',
      'Science': 'success',
      'Chemistry': 'success',
      'Biology': 'success',
      'History': 'warn',
      'English': 'secondary',
      'Music': 'secondary',
      'Art': 'secondary',
    };
    return map[subject] ?? 'secondary';
  }

  switchToPortal(): void {
    this.portalTeacherId.set('');
    this.loginError.set('');
    this.viewMode.set('login');
  }

  portalLogin(): void {
    const id = this.portalTeacherId().trim().toUpperCase();
    const match = this.teachers().find(t => t.teacherId.toUpperCase() === id);
    if (!match) {
      this.loginError.set('Teacher ID not found. Please try again.');
      return;
    }
    this.portalTeacher.set(match);
    this.loginError.set('');
    this.viewMode.set('portal');
  }

  portalLogout(): void {
    this.portalTeacher.set(null);
    this.viewMode.set('login');
  }

  portalPaymentHistory(): { month: string; amount: number }[] {
    const teacher = this.portalTeacher();
    if (!teacher) return [];
    const base = teacher.monthlyPension;
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        month: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        amount: base
      };
    });
  }

  private showSuccess(msg: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  }

  private showError(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg, life: 4000 });
  }
}
