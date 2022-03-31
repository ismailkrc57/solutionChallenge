export interface SolutionAddModel {
  id: number
  date: string;
  description: string;
  homework: {
    id: number
  },
  student: {
    id: number
  }
}
