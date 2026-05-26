export type PensionStatus = 'ACTIVE' | 'SUSPENDED' | 'DECEASED';

export interface RetiredTeacher {
  id?: number;
  firstName: string;
  lastName: string;
  teacherId: string;
  subject: string;
  yearsOfService: number;
  retirementDate: string;
  pensionStartDate: string;
  monthlyPension: number;
  status: PensionStatus;
}
