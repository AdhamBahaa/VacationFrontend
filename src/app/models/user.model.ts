export interface IUser {
  id: number;
  name: string;
  casualDays: number;
  annualDays: number;
  email: string;
  password: string | null;
  managerId: number | null;
}

export interface IUserCredentials {
  email: string;
  password: string;
}

export interface IUserBalance {
  casualDays: number;
  annualDays: number;
}
