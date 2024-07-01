import Company from '../model/company';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { HttpError } from '../errorHandling/custonError';
import { createConnection } from '../config/db.config';
import { buildUpdateQuery } from '../utils/queryBuilder';
import { ChangeStatus } from '../model/changeStatus';

interface ICompanyRepository {
  save(company: Company): Promise<number>;
  searchAll(): Promise<Company[]>;
  searchById(idCompany: number): Promise<Company>;
  searchByName(name: string): Promise<Company>;
  update(company: Company): Promise<Company>;
  changeStatus(status: ChangeStatus): Promise<void>;
}

class CompanyRepository implements ICompanyRepository {
  public async save(company: Company): Promise<number> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<ResultSetHeader>(
        `INSERT INTO 
          company 
        (name, associate) 
          VALUES 
        (?, ?)`,
        [company.name, company.associate]
      );
      return rows.insertId;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAll(): Promise<Company[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM company WHERE active = true`
      );
      return rows as Company[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchById(idCompany: number): Promise<Company> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM company WHERE id = (?) AND active = true`,
        [idCompany]
      );
      return rows[0] as Company;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchByName(name: string): Promise<Company> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM company WHERE name like (?)`,
        [name]
      );
      return rows[0] as Company;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async update(company: Company): Promise<Company> {
    const connection = await createConnection();
    try {
      const { query, values } = buildUpdateQuery(
        'company',
        company,
        company.id
      );
      const [result] = await connection.execute<ResultSetHeader>(query, values);
      if (result.affectedRows === 0) {
        throw new Error('No rows updated');
      }

      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM company WHERE id = (?)`,
        [company.id]
      );
      return rows[0] as Company;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async changeStatus(status: ChangeStatus): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.execute(`UPDATE company SET active ? WHERE id = ?`, [
        status.active,
        status.id
      ]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }
}

export default new CompanyRepository();
