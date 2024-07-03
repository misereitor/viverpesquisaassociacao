import Category from './category';
import Company from './company';
import UserAdmin from './userAdmin';

export interface LogsCompany {
  id: number;
  company_id: number;
  action: string;
  old_value: Company;
  new_value: Company;
  date: Date;
  user_id: number;
}

export interface LogsCategory {
  id: number;
  category_id: number;
  action: string;
  old_value: Category;
  new_value: Category;
  date: Date;
  user_id: number;
}

export interface LogsUserAdmin {
  id: number;
  user_admin_id: number;
  action: string;
  old_value: UserAdmin;
  new_value: UserAdmin;
  date: Date;
  user_id: number;
}

export interface LogsCompanyCategory {
  id: number;
  category_id: number;
  company_id: number;
  action: string;
  date: Date;
  user_id: number;
}

export interface TokenDecodeLog {
  id: number;
  username: string;
}
