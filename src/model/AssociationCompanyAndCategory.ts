import Category from './category';
import Company from './company';

export default interface AssCompanyAndCategory {
  id: number;
  company_id: number;
  category_id: number;
}

export interface AssCompanyAndCategoryInDB {
  id: number;
  category_id: number;
  category_name: string;
  company_name: string;
  company_id: number;
  company_associate: boolean;
  active: boolean;
}

export interface ResponseAssCompanyAndCategory {
  id: number;
  category: Category;
  companyAssociate: Company[];
}
