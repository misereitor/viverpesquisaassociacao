import { RowDataPacket } from 'mysql2';

export default interface UserAdmin extends RowDataPacket {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  role: string;
}

export interface UserAdminResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

export interface AlterPasswordRequest {
  id: number;
  password: string;
}

export interface IdUserAdminRequest {
  id: number;
}

export interface UserNameAdminRequest {
  username: string;
}

export interface LoginAdmin {
  username: string;
  password: string;
}
