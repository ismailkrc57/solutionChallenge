export interface CommentAddModel {
  text: string;
  student: {
    id: number
  }
  solution: {
    id: number
  }
  homework: {
    id: number
  }

}
