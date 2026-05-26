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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';

import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule, FormsModule, RouterLink,
    TableModule, ButtonModule, InputTextModule, SelectModule,
    DialogModule, TagModule, ToastModule, ConfirmDialogModule,
    CardModule, IconFieldModule, InputIconModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeListComponent implements OnInit {
  employees = signal<Employee[]>([]);
  showForm = signal(false);
  showRaiseModal = signal(false);
  showLog = signal(false);
  editingEmployee = signal<Employee | null>(null);
  searchTerm = signal('');
  departmentFilter = signal<string | null>(null);
  raiseDept = signal('');
  raisePercent = signal(5);
  activityLog = signal<{ time: string; message: string }[]>([]);

  formEmployee: Employee = this.emptyEmployee();

  departments = computed(() =>
    [...new Set(this.employees().map(e => e.department))].sort().map(d => ({ label: d, value: d }))
  );

  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const dept = this.departmentFilter();
    return this.employees().filter(e => {
      const matchesSearch = !term ||
        e.firstName.toLowerCase().includes(term) ||
        e.lastName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term);
      const matchesDept = !dept || e.department === dept;
      return matchesSearch && matchesDept;
    });
  });

  totalPayroll = computed(() =>
    this.employees().reduce((sum, e) => sum + (e.salary ?? 0), 0)
  );

  maxSalary = computed(() =>
    Math.max(...this.employees().map(e => e.salary ?? 0), 1)
  );

  topEarnerId = computed(() => {
    const top = this.employees().reduce(
      (best, e) => (e.salary ?? 0) > (best?.salary ?? 0) ? e : best,
      this.employees()[0]
    );
    return top?.id ?? null;
  });

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => this.employees.set(data),
      error: () => this.showError('Could not reach the server. Is Spring Boot running on port 8080?')
    });
  }

  openAddForm(): void {
    this.formEmployee = this.emptyEmployee();
    this.editingEmployee.set(null);
    this.showForm.set(true);
  }

  openEditForm(emp: Employee): void {
    this.formEmployee = { ...emp };
    this.editingEmployee.set(emp);
    this.showForm.set(true);
  }

  submitForm(): void {
    const editing = this.editingEmployee();
    if (editing) {
      this.employeeService.update(editing.id!, this.formEmployee).subscribe({
        next: (updated) => {
          this.employees.update(list => list.map(e => e.id === updated.id ? updated : e));
          this.showForm.set(false);
          const msg = `Updated ${updated.firstName} ${updated.lastName}.`;
          this.showSuccess(msg);
          this.logActivity(msg);
        },
        error: () => this.showError('Failed to update employee.')
      });
    } else {
      this.employeeService.create(this.formEmployee).subscribe({
        next: (created) => {
          this.employees.update(list => [...list, created]);
          this.showForm.set(false);
          const msg = `Added ${created.firstName} ${created.lastName} to ${created.department}.`;
          this.showSuccess(msg);
          this.logActivity(msg);
        },
        error: (err) => this.showError(err.error || 'Failed to create employee.')
      });
    }
  }

  confirmDelete(emp: Employee): void {
    this.confirmationService.confirm({
      message: `Remove <strong>${emp.firstName} ${emp.lastName}</strong> from the system? This cannot be undone.`,
      header: 'Remove Employee',
      icon: 'pi pi-trash',
      acceptLabel: 'Yes, Remove',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.employeeService.delete(emp.id!).subscribe({
          next: () => {
            this.employees.update(list => list.filter(e => e.id !== emp.id));
            const msg = `Removed ${emp.firstName} ${emp.lastName}.`;
            this.showSuccess(msg);
            this.logActivity(msg);
          },
          error: () => this.showError('Failed to delete employee.')
        });
      }
    });
  }

  openRaiseModal(): void {
    this.raiseDept.set(this.employees()[0]?.department ?? '');
    this.raisePercent.set(5);
    this.showRaiseModal.set(true);
  }

  submitRaise(): void {
    const dept = this.raiseDept();
    const pct = this.raisePercent();
    if (!dept || pct <= 0) return;
    this.employeeService.applyRaise(dept, pct).subscribe({
      next: (updated) => {
        this.employees.update(list => list.map(e => updated.find(u => u.id === e.id) ?? e));
        this.showRaiseModal.set(false);
        const msg = `${pct}% raise applied to ${updated.length} employee${updated.length !== 1 ? 's' : ''} in ${dept}.`;
        this.showSuccess(msg);
        this.logActivity(msg);
      },
      error: () => this.showError('Failed to apply raise.')
    });
  }

  exportCsv(): void {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Salary'];
    const rows = this.filteredEmployees().map(e =>
      [e.id, e.firstName, e.lastName, e.email, e.department, e.salary]
    );
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  salaryBarPct(salary: number): number {
    return Math.round((salary / this.maxSalary()) * 100);
  }

  deptSeverity(dept: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      Engineering: 'info',
      HR: 'success',
      Finance: 'warn',
      Marketing: 'contrast' as any,
      Sales: 'danger',
    };
    return map[dept] ?? 'secondary';
  }

  private logActivity(message: string): void {
    const time = new Date().toLocaleTimeString();
    this.activityLog.update(log => [{ time, message }, ...log]);
  }

  private showSuccess(msg: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  }

  private showError(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg, life: 4000 });
  }

  private emptyEmployee(): Employee {
    return { firstName: '', lastName: '', email: '', department: '', salary: 0 };
  }
}
