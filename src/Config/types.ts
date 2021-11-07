export interface Incidence {
    initDateTime: string;
    finishDate: string;
    finishTime: string;
    issueDesc: string;
    owner: string;
    ownerId: number;
    solver: string;
    solverId: number;
    state: number;
    pieces: Array<Piece>;
    id: number;
    notes: Array<Note>;
  }
  export interface Note {
    date: string;
    noteStr: string;
    noteType?: string;
    incidence?: number;
    employee?: number;
  }
  export interface Piece {
    type: PieceType;
    name: string;
    price?: string;
    quantity?: number;
    description?: string;
    id: number;
    deleted?: number
  }
  export interface PieceType {
    name: string;
    description: string;
    id: number;
  }
  export interface Employee {
    id: number;
    name: string;
    surname1: string;
    surname2: string;
    tipo: EmployeeType;
    dni: string;
  }
  export interface EmployeeType {
    id: number;
    level: number;
    name: string;
  }