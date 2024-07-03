import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { createConnection } from '../config/db.config';
import AssCompanyAndCategory, {
  AssCompanyAndCategoryInDB
} from '../model/AssociationCompanyAndCategory';
import { HttpError } from '../errorHandling/custonError';

interface IAssociationCompanyAndCategoryRepository {
  create(association: AssCompanyAndCategory): Promise<number>;
  searchAll(): Promise<AssCompanyAndCategoryInDB[]>;
  searchByIdCategory(idCategory: number): Promise<AssCompanyAndCategoryInDB[]>;
  searchByIdCompany(idCompany: number): Promise<AssCompanyAndCategoryInDB[]>;
  searchByIdCompanyAndCategory(
    association: AssCompanyAndCategory
  ): Promise<AssCompanyAndCategory[]>;
  delete(association: AssCompanyAndCategory): Promise<void>;
}

class AssociationCompanyAndCategoryRepository
  implements IAssociationCompanyAndCategoryRepository
{
  public async create(association: AssCompanyAndCategory): Promise<number> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<ResultSetHeader>(
        `INSERT INTO 
          company_category 
        (category_id, company_id) 
          VALUES 
        (?, ?)`,
        [association.category_id, association.company_id]
      );
      return rows.insertId;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAll(): Promise<AssCompanyAndCategoryInDB[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT
          company_category.id,
          category.id AS category_id,
          category.name AS category_name,
          company.name AS company_name,
          company.id AS company_id,
          company.associate AS company_associate
        FROM
          company_category
        JOIN
          company ON company_category.company_id = company.id
        JOIN
          category ON company_category.category_id = category.id
        WHERE
          company.active = true AND category.active = true`
      );
      return rows as AssCompanyAndCategoryInDB[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchByIdCategory(
    idCategory: number
  ): Promise<AssCompanyAndCategoryInDB[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT
          company_category.id,
          category.id AS category_id,
          category.name AS category_name,
          company.name AS company_name,
          company.id AS company_id,
          company.associate AS company_associate
        FROM
          company_category
        JOIN
          company ON company_category.company_id = company.id
        JOIN
          category ON company_category.category_id = category.id
        WHERE company_category.category_id = ? 
        AND company.active = true AND category.active = true`,
        [idCategory]
      );
      return rows as AssCompanyAndCategoryInDB[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchByIdCompany(
    idCompany: number
  ): Promise<AssCompanyAndCategoryInDB[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT
          company_category.id,
          category.id AS category_id,
          category.name AS category_name,
          company.name AS company_name,
          company.id AS company_id,
          company.associate AS company_associate
        FROM
          company_category
        JOIN
          company ON company_category.company_id = company.id
        JOIN
          category ON company_category.category_id = category.id
        WHERE company_category.company_id = ?
        AND company.active = true AND category.active = true`,
        [idCompany]
      );
      return rows as AssCompanyAndCategoryInDB[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchByIdCompanyAndCategory(
    association: AssCompanyAndCategory
  ): Promise<AssCompanyAndCategory[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM company_category 
        WHERE company_id = ? and category_id = ?`,
        [association.company_id, association.category_id]
      );
      return rows as AssCompanyAndCategory[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async delete(association: AssCompanyAndCategory): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.execute(
        `DELETE FROM company_category WHERE company_id = ? and category_id = ?`,
        [association.company_id, association.category_id]
      );
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }
}

export default new AssociationCompanyAndCategoryRepository();
