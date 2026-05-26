import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list';
import { StatsComponent } from './stats/stats';
import { PensionComponent } from './pension/pension';

export const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'pension', component: PensionComponent },
];
