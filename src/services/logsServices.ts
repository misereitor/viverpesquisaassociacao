import { HttpError } from '../errorHandling/custonError';
import {
  LogsUserAdmin,
  LogsCompany,
  LogsCategory,
  LogsCompanyCategory,
  TokenDecodeLog
} from '../model/logs';
import logsRepository from '../repositiry/logsRepository';
import { decode } from 'jsonwebtoken';

interface ILogsServices {
  createLogUserAdmin(log: LogsUserAdmin, token: string): Promise<void>;
  createLogCompany(log: LogsCompany, token: string): Promise<void>;
  createLogCategory(log: LogsCategory, token: string): Promise<void>;
  createLogCompany_Category(
    log: LogsCompanyCategory,
    token: string
  ): Promise<void>;
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

class LogsServices implements ILogsServices {
  public async createLogUserAdmin(
    log: LogsUserAdmin,
    token: string
  ): Promise<void> {
    try {
      const tokenDecode = this.getUserAdmin(token);
      log.user_id = tokenDecode.id;
      await logsRepository.createLogUserAdmin(log);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async createLogCompany(
    log: LogsCompany,
    token: string
  ): Promise<void> {
    try {
      const tokenDecode = this.getUserAdmin(token);
      log.user_id = tokenDecode.id;
      await logsRepository.createLogCompany(log);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async createLogCategory(
    log: LogsCategory,
    token: string
  ): Promise<void> {
    try {
      const tokenDecode = this.getUserAdmin(token);
      log.user_id = tokenDecode.id;
      await logsRepository.createLogCategory(log);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async createLogCompany_Category(
    log: LogsCompanyCategory,
    token: string
  ): Promise<void> {
    try {
      const tokenDecode = this.getUserAdmin(token);
      log.user_id = tokenDecode.id;
      await logsRepository.createLogCompany_Category(log);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAllLogUserAdmin(): Promise<LogsUserAdmin[]> {
    try {
      const logs = await logsRepository.searchAllLogUserAdmin();
      return logs;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAllLogCompany(): Promise<LogsCompany[]> {
    try {
      const logs = await logsRepository.searchAllLogCompany();
      return logs;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAllLogCategory(): Promise<LogsCategory[]> {
    try {
      const logs = await logsRepository.searchAllLogCategory();
      return logs;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAllLogCompany_Category(): Promise<LogsCompanyCategory[]> {
    try {
      const logs = await logsRepository.searchAllLogCompany_Category();
      return logs;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAllLogUserAdminByIdUserAdmin(
    id: number
  ): Promise<LogsUserAdmin[]> {
    try {
      const logs = await logsRepository.searchAllLogUserAdminByIdUserAdmin(id);
      return logs;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAllLogCompanyByIdCompany(
    id: number
  ): Promise<LogsCompany[]> {
    try {
      const logs = await logsRepository.searchAllLogCompanyByIdCompany(id);
      return logs;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAllLogCategoryByIdCategory(
    id: number
  ): Promise<LogsCategory[]> {
    try {
      const logs = await logsRepository.searchAllLogCategoryByIdCategory(id);
      return logs;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAllLogCompany_CategoryByIdCategory(
    id: number
  ): Promise<LogsCompanyCategory[]> {
    try {
      const logs =
        await logsRepository.searchAllLogCompany_CategoryByIdCategory(id);
      return logs;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAllLogCompany_CategoryByIdCompany(
    id: number
  ): Promise<LogsCompanyCategory[]> {
    try {
      const logs =
        await logsRepository.searchAllLogCompany_CategoryByIdCompany(id);
      return logs;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  private getUserAdmin(token: string): TokenDecodeLog {
    const tokenDecode = decode(token);
    return tokenDecode as TokenDecodeLog;
  }
}

export default new LogsServices();
