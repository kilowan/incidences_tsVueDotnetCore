export interface base {
  id: number;
}
export interface Incidence extends base {
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
    notes: Array<Note>;
  }
  export interface Note {
    date: string;
    noteStr: string;
    noteType?: string;
    incidence?: number;
    employee?: number;
  }
  export interface PieceClass extends base {
    type: PieceType;
    name: string;
  }
  export interface Piece extends PieceClass {
    price?: string;
    quantity?: number;
    description?: string;
    deleted?: number
  }
  export interface PieceType extends base {
    name: string;
    description: string;
  }
  export interface Employee extends base {
    name: string;
    surname1: string;
    surname2: string;
    tipo: EmployeeType;
    dni: string;
  }
  export interface EmployeeType extends base {
    level: number;
    name: string;
  }