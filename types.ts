export interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: boolean[]; // Array of 28 booleans for 4 weeks
}

export interface User {
  name: string;
  email: string;
}

export interface ChartData {
  name: string;
  value: number;
}
