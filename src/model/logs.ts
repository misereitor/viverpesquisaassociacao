import Company from './company';

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
  old_value: Company;
  new_value: Company;
  date: Date;
  user_id: number;
}

export interface LogsUserAdmin {
  id: number;
  user_admin_id: number;
  action: string;
  old_value: Company;
  new_value: Company;
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
