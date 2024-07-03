import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { createConnection } from '../config/db.config';
import UserAdmin, { AlterPasswordRequest } from '../model/userAdmin';
import { HttpError } from '../errorHandling/custonError';
import { buildUpdateQuery } from '../utils/queryBuilder';
import { ChangeStatus } from '../model/changeStatus';

interface IUserAdminRepository {
  save(userAdmin: UserAdmin): Promise<number>;
  searchAll(): Promise<UserAdmin[]>;
  searchById(idUserAdmin: number): Promise<UserAdmin>;
  searchByUserName(username: string): Promise<UserAdmin>;
  update(userAdmin: UserAdmin): Promise<UserAdmin>;
  alterPassword(alterPassword: AlterPasswordRequest): Promise<UserAdmin>;
  changeStatus(status: ChangeStatus): Promise<UserAdmin>;
}

class UserAdminRepository implements IUserAdminRepository {
  public async save(userAdmin: UserAdmin): Promise<number> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<ResultSetHeader>(
        `INSERT INTO 
          user_admin 
        (name, username, password, email, role) 
          VALUES 
        (?, ?, ?, ?, ?)`,
        [
          userAdmin.name,
          userAdmin.username,
          userAdmin.password,
          userAdmin.email,
          userAdmin.role
        ]
      );
      return rows.insertId;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAll(): Promise<UserAdmin[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM user_admin'
      );
      return rows as UserAdmin[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchById(idUserAdmin: number): Promise<UserAdmin> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM user_admin WHERE id = (?)',
        [idUserAdmin]
      );
      return rows[0] as UserAdmin;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchByUserName(username: string): Promise<UserAdmin> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM user_admin WHERE username LIKE (?)',
        [username]
      );
      return rows[0] as UserAdmin;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async update(userAdmin: UserAdmin): Promise<UserAdmin> {
    const connection = await createConnection();
    try {
      const { query, values } = buildUpdateQuery(
        'user_admin',
        userAdmin,
        userAdmin.id
      );
      const [result] = await connection.execute<ResultSetHeader>(query, values);
      if (result.affectedRows === 0) {
        throw new Error('No rows updated');
      }
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM user_admin WHERE id = ?',
        [userAdmin.id]
      );
      return rows[0] as UserAdmin;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async alterPassword(
    alterPassword: AlterPasswordRequest
  ): Promise<UserAdmin> {
    const connection = await createConnection();
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE user_admin SET password = ? WHERE id = ?`,
        [alterPassword.password, alterPassword.id]
      );
      if (result.affectedRows === 0) {
        throw new Error('No rows updated');
      }
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM user_admin WHERE id = ?',
        [alterPassword.id]
      );
      return rows[0] as UserAdmin;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async changeStatus(status: ChangeStatus): Promise<UserAdmin> {
    const connection = await createConnection();
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        'UPDATE user_admin SET active ? WHERE id = ?',
        [status.active, status.id]
      );
      if (result.affectedRows === 0) {
        throw new Error('No rows updated');
      }
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM user_admin WHERE id = ?',
        [status.id]
      );
      return rows[0] as UserAdmin;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }
}

export default new UserAdminRepository();
