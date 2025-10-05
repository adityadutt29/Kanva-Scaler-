export type Board = {
  _id?: string;
 name: string;
 columns?: Columns[];
  createdBy?: string;
  dateCreated?: string;
  backgroundImage?: string;
  users?: Array<string>;
};

export type ActivityLogEntry = {
  _id: string;
  boardId: string;
 actorId: string;
  actorName?: string;
  action: string;
  targetId?: string;
  targetType?: string;
  timestamp: string | Date;
  details?: any;
};

export type BoardSlice = {
  board: Board;
 activityLog: ActivityLogEntry[];
  status: string;
 isLoading: boolean;
  error: string;
};

type Columns = {
  id: string;
  name: string;
  sequence: number;
  cards?: Cards[];
  createdBy: string;
  date: Date;
};

type Cards = {
  id: string;
  name: string;
  description: string;
  assignedTo?: User[];
  sequence: number;
  createdBy: string;
  date: Date;
};

type User = {
  id: string;
  name: string;
  avatar: string;
};
