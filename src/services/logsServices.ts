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
    const tokenDecode = this.getUserAdmin(token);
    log.user_id = tokenDecode.id;
    await logsRepository.createLogUserAdmin(log);
  }

  public async createLogCompany(
    log: LogsCompany,
    token: string
  ): Promise<void> {
    const tokenDecode = this.getUserAdmin(token);
    log.user_id = tokenDecode.id;
    await logsRepository.createLogCompany(log);
  }

  public async createLogCategory(
    log: LogsCategory,
    token: string
  ): Promise<void> {
    const tokenDecode = this.getUserAdmin(token);
    log.user_id = tokenDecode.id;
    await logsRepository.createLogCategory(log);
  }

  public async createLogCompany_Category(
    log: LogsCompanyCategory,
    token: string
  ): Promise<void> {
    const tokenDecode = this.getUserAdmin(token);
    log.user_id = tokenDecode.id;
    await logsRepository.createLogCompany_Category(log);
  }

  public async searchAllLogUserAdmin(): Promise<LogsUserAdmin[]> {
    const logs = logsRepository.searchAllLogUserAdmin();
    return logs;
  }

  public async searchAllLogCompany(): Promise<LogsCompany[]> {
    const logs = logsRepository.searchAllLogCompany();
    return logs;
  }

  public async searchAllLogCategory(): Promise<LogsCategory[]> {
    const logs = logsRepository.searchAllLogCategory();
    return logs;
  }

  public async searchAllLogCompany_Category(): Promise<LogsCompanyCategory[]> {
    const logs = logsRepository.searchAllLogCompany_Category();
    return logs;
  }

  public async searchAllLogUserAdminByIdUserAdmin(
    id: number
  ): Promise<LogsUserAdmin[]> {
    const logs = logsRepository.searchAllLogUserAdminByIdUserAdmin(id);
    return logs;
  }

  public async searchAllLogCompanyByIdCompany(
    id: number
  ): Promise<LogsCompany[]> {
    const logs = logsRepository.searchAllLogCompanyByIdCompany(id);
    return logs;
  }

  public async searchAllLogCategoryByIdCategory(
    id: number
  ): Promise<LogsCategory[]> {
    const logs = logsRepository.searchAllLogCategoryByIdCategory(id);
    return logs;
  }

  public async searchAllLogCompany_CategoryByIdCategory(
    id: number
  ): Promise<LogsCompanyCategory[]> {
    const logs = logsRepository.searchAllLogCompany_CategoryByIdCategory(id);
    return logs;
  }

  public async searchAllLogCompany_CategoryByIdCompany(
    id: number
  ): Promise<LogsCompanyCategory[]> {
    const logs = logsRepository.searchAllLogCompany_CategoryByIdCompany(id);
    return logs;
  }

  private getUserAdmin(token: string): TokenDecodeLog {
    const tokenDecode = decode(token);
    return tokenDecode as TokenDecodeLog;
  }
}

export default new LogsServices();
