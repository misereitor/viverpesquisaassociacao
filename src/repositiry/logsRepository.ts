import { ResultSetHeader, RowDataPacket } from 'mysql2';
import {
  LogsCategory,
  LogsCompany,
  LogsCompanyCategory,
  LogsUserAdmin
} from '../model/logs';
import { createConnection } from '../config/db.config';
import { HttpError } from '../errorHandling/custonError';

interface ILogsRepository {
  createLogUserAdmin(log: LogsUserAdmin): Promise<void>;
  createLogCompany(log: LogsCompany): Promise<void>;
  createLogCategory(log: LogsCategory): Promise<void>;
  createLogCompany_Category(log: LogsCompanyCategory): Promise<void>;
  searchAllLogUserAdmin(): Promise<LogsUserAdmin[]>;
  searchAllLogCompany(): Promise<LogsCompany[]>;
  searchAllLogCategory(): Promise<LogsCategory[]>;
  searchAllLogCompany_Category(): Promise<LogsCompanyCategory[]>;
  searchAllLogUserAdminByIdUserAdmin(id: number): Promise<LogsUserAdmin[]>;
  searchAllLogCompanyByIdCompany(id: number): Promise<LogsCompany[]>;
  searchAllLogCategoryByIdCategory(id: number): Promise<LogsCategory[]>;
  searchAllLogCompany_CategoryByIdCategory(
    id: number
  ): Promise<LogsCompanyCategory[]>;
  searchAllLogCompany_CategoryByIdCompany(
    id: number
  ): Promise<LogsCompanyCategory[]>;
}

class LogsRepository implements ILogsRepository {
  public async createLogUserAdmin(log: LogsUserAdmin): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO 
          user_admin_log 
        (user_admin_id, action, old_value, new_value, user_id) 
          VALUES 
        (?, ?, ?, ?, ?)`,
        [
          log.user_admin_id,
          log.action,
          log.old_value,
          log.new_value,
          log.user_id
        ]
      );
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async createLogCompany(log: LogsCompany): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO 
          company_log 
        (company_id, action, old_value, new_value, user_id) 
          VALUES 
        (?, ?, ?, ?, ?)`,
        [log.company_id, log.action, log.old_value, log.new_value, log.user_id]
      );
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async createLogCategory(log: LogsCategory): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO 
          category_log 
        (category_id, action, old_value, new_value, user_id) 
          VALUES 
        (?, ?, ?, ?, ?)`,
        [log.category_id, log.action, log.old_value, log.new_value, log.user_id]
      );
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async createLogCompany_Category(
    log: LogsCompanyCategory
  ): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO 
          company_category_log 
        (category_id, company_id, action, user_id) 
          VALUES 
        (?, ?, ?, ?)`,
        [log.category_id, log.company_id, log.action, log.user_id]
      );
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAllLogUserAdmin(): Promise<LogsUserAdmin[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM user_admin_log'
      );
      return rows as LogsUserAdmin[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAllLogCompany(): Promise<LogsCompany[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM company_log'
      );
      return rows as LogsCompany[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAllLogCategory(): Promise<LogsCategory[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM category_log'
      );
      return rows as LogsCategory[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAllLogCompany_Category(): Promise<LogsCompanyCategory[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM company_category_log'
      );
      return rows as LogsCompanyCategory[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAllLogUserAdminByIdUserAdmin(
    id: number
  ): Promise<LogsUserAdmin[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM user_admin_log WHERE user_admin_id = ?',
        [id]
      );
      return rows as LogsUserAdmin[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAllLogCompanyByIdCompany(
    id: number
  ): Promise<LogsCompany[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM company_log WHERE company_id = ?',
        [id]
      );
      return rows as LogsCompany[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAllLogCategoryByIdCategory(
    id: number
  ): Promise<LogsCategory[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM category_log WHERE category_id = ?',
        [id]
      );
      return rows as LogsCategory[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAllLogCompany_CategoryByIdCategory(
    id: number
  ): Promise<LogsCompanyCategory[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM company_category_log WHERE category_id = ?',
        [id]
      );
      return rows as LogsCompanyCategory[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }

  public async searchAllLogCompany_CategoryByIdCompany(
    id: number
  ): Promise<LogsCompanyCategory[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM company_category_log WHERE company_id = ?',
        [id]
      );
      return rows as LogsCompanyCategory[];
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new HttpError(500, String(error));
    } finally {
      await connection.end();
    }
  }
}

export default new LogsRepository();
