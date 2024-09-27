import { IUser } from './user.model';

export interface IRequest {
  id: number;
  typeId: number;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  userId: number | undefined;
  user: IUser | undefined;
  statusId: number;
}
