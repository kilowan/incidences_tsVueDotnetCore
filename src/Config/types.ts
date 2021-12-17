export interface base {
  id: number;
}
export interface Incidence extends base {
    initDateTime: string;
    finishDateTime?: string;
    issueDesc: string;
    owner: string;
    ownerId: number;
    solver?: string;
    solverId?: number;
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
    deleted?: boolean
  }
  export interface PieceType extends base {
    name: string;
    description: string;
  }
  export interface Employee extends base {
    name: string;
    surname1: string;
    surname2: string;
    fullName: string;
    type: EmployeeType;
    dni: string;
    state: number;
    email: Email;
  }
  export interface EmployeeType extends base {
    name: string;
  }
  export interface Email {
    mailName: string;
    domain: string;
  }