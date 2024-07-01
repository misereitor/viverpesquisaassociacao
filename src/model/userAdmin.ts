export default interface UserAdmin {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  role: string;
  active: boolean;
}

export interface UserAdminResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
}

export interface AlterPasswordRequest {
  id: number;
  password: string;
}

export interface LoginAdmin {
  username: string;
  password: string;
}
