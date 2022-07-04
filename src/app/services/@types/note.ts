export interface Note {
  id: number;
  text: string;
  date: Date;
  urgent?: boolean;
}

export interface NewNote {
  text: string;
  urgent: boolean;
}
