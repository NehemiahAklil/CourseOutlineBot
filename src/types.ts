import { Context, SessionFlavor } from 'grammy';

export enum DepartmentType {
  AB = 'Applied Biology',
  AC = 'Applied Chemistry',
  P = 'Pharmacy',
  IC = 'Industrial Chemistry',
  AG = 'Applied Geology',
  AM = 'Applied Mathematics',
  AP = 'Applied Physics',
  ARCH = 'Architecture',
  CivE = 'Civil Engineering',
  GE = 'Geomatics Engineering',
  WRE = 'Water Resources Engineering ',
  CSE = 'Computer Science and Engineering',
  SE = 'Software Engineering',
  ECE = 'Electronics and Communication Engineering',
  EPCE = 'Electrical Power and control Engineering',
  ChE = 'Chemical Engineering',
  MSE = 'Materials Science and Engineering',
  ME = 'Mechanical  Engineering',
}
export interface CourseInfo {
  course: string[];
  year: Year[];
  semester: Semester[];
  school: School[][];
  department: Department[][];
}

export enum SchoolType {
  SoANS = 'School of Applied Natural Sciences',
  SoCEA = 'School of Civil Engineering and Architecture',
  SoEEC = 'School of Electrical Engineering and Computing',
  SoMCME = 'School of Mechanical, Chemical, and Materials Engineering',
}

export enum YearType {
  First = 'Freshman/First Year',
  Second = 'Sophomore/Second Year',
  Third = 'Middler/Third Year',
  Fourth = 'Junior/Fourth Year',
  Fifth = 'Senior/Fifth Year',
}
export enum SemesterType {
  sem1 = 'sem1',
  sem2 = 'sem2',
}
export type School = keyof typeof SchoolType;
export type Department = keyof typeof DepartmentType;
export type Year = keyof typeof YearType;
export type Semester = keyof typeof SemesterType;

// Define the shape of our session.
export interface SessionData {
  year_type: YearType;
  department_type: DepartmentType;
  school_type: SchoolType;
  semester_type: SemesterType;
}

// Flavor the context type to include sessions.
export type MyContext = Context & SessionFlavor<SessionData>;
