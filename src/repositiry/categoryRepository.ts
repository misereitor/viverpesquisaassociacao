import Category from '../model/category';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { HttpError } from '../errorHandling/custonError';
import { createConnection } from '../config/db.config';
import { ChangeStatus } from '../model/changeStatus';

interface ICategoryRepository {
  save(category: Category): Promise<number>;
  searchAll(): Promise<Category[]>;
  searchById(idCategory: number): Promise<Category>;
  searchByName(name: string): Promise<Category>;
  update(category: Category): Promise<Category>;
  changeStatus(status: ChangeStatus): Promise<void>;
}

class CategoryRepository implements ICategoryRepository {
  public async save(category: Category): Promise<number> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<ResultSetHeader>(
        `INSERT INTO 
          category 
        (name) 
          VALUES 
        (?)`,
        [category.name]
      );
      return rows.insertId;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAll(): Promise<Category[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM category WHERE active = true`
      );
      return rows as Category[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchById(idCategory: number): Promise<Category> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM category WHERE id = (?) AND active = true`,
        [idCategory]
      );
      return rows[0] as Category;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchByName(name: string): Promise<Category> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM category WHERE name like (?)`,
        [name]
      );
      return rows[0] as Category;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async update(category: Category): Promise<Category> {
    const connection = await createConnection();
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE category SET name = ? WHERE id = ?`,
        [category.name, category.id]
      );
      if (result.affectedRows === 0) {
        throw new Error('No rows updated');
      }

      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM category WHERE id = (?)`,
        [category.id]
      );
      return rows[0] as Category;
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
      await connection.execute(`UPDATE category SET active ? WHERE id = ?`, [
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

export default new CategoryRepository();
