import UserAdmin, {
  AlterPasswordRequest,
  UserAdminResponse
} from '../model/userAdmin';
import * as bcrypt from 'bcrypt';
import userAdminRepository from '../repositiry/userAdminRepository';
import {
  schemaAddUserAdmin,
  schemaAlterPassword,
  schemaUserAdminUsername,
  schemaUserAdminName,
  schemaUserAdminEmail,
  schemaUserAdminRole
} from '../schema/validationUserAdmin';
import { ZodError, ZodIssue } from 'zod';
import { HttpError } from '../errorHandling/custonError';
import { ChangeStatus } from '../model/changeStatus';
import { LogsUserAdmin } from '../model/logs';
import logsServices from './logsServices';

interface IUserAdminService {
  createUserAdmin(
    userAdmin: UserAdmin,
    token: string
  ): Promise<UserAdminResponse>;
  searchAll(): Promise<UserAdminResponse[]>;
  searchById(idUserAdmin: number): Promise<UserAdminResponse>;
  searchByUserName(userName: string): Promise<UserAdminResponse>;
  update(userAdmin: UserAdmin, token: string): Promise<UserAdminResponse>;
  alterPassword(
    alterPassword: AlterPasswordRequest,
    token: string
  ): Promise<void>;
  changeStatus(idUserAdmin: number, token: string): Promise<void>;
}

interface ValidUserUpdate {
  success: boolean;
  error: ErrorsValidateUserUpdate[];
}

interface ErrorsValidateUserUpdate {
  errors: ZodIssue[];
}

class UserAdminService implements IUserAdminService {
  public async createUserAdmin(
    userAdmin: UserAdmin,
    token: string
  ): Promise<UserAdminResponse> {
    try {
      const userAdminExist = await userAdminRepository.searchByUserName(
        userAdmin.username
      );
      if (userAdminExist) {
        throw new HttpError(302, 'Usuario já cadastrado!');
      }

      const validateResult = schemaAddUserAdmin.safeParse(userAdmin);
      if (!validateResult.success) {
        throw new ZodError(validateResult.error.errors);
      }

      userAdmin.password = await this.encryptPassword(userAdmin.password);
      const idUserAdminInsert = await userAdminRepository.save(userAdmin);

      userAdmin.id = idUserAdminInsert;
      await this.createLogs(userAdmin, userAdmin, 'create', token);
      return this.converterUserAdminForResponse(userAdmin);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((e) => e.message).join(', ');
        throw new HttpError(406, `Validation error: ${errorMessages}`);
      }
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAll(): Promise<UserAdminResponse[]> {
    try {
      const searchUserAdmin = await userAdminRepository.searchAll();
      return this.converterAllUserAdminForResponse(searchUserAdmin);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchById(idUserAdmin: number): Promise<UserAdminResponse> {
    try {
      if (!(idUserAdmin > 0)) {
        throw new HttpError(404, 'Usuário não encontrado');
      }
      const searchUserAdmin = await userAdminRepository.searchById(idUserAdmin);
      if (!searchUserAdmin) {
        throw new HttpError(404, 'Usuário não encontrado');
      }
      return this.converterUserAdminForResponse(searchUserAdmin);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  private async searchByIdForLog(idUserAdmin: number): Promise<UserAdmin> {
    try {
      if (!(idUserAdmin > 0)) {
        throw new HttpError(404, 'Usuário não encontrado');
      }
      const searchUserAdmin = await userAdminRepository.searchById(idUserAdmin);
      if (!searchUserAdmin) {
        throw new HttpError(404, 'Usuário não encontrado');
      }
      return searchUserAdmin;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchByUserName(userName: string): Promise<UserAdminResponse> {
    try {
      const searchUserAdmin =
        await userAdminRepository.searchByUserName(userName);
      if (!searchUserAdmin) {
        throw new HttpError(404, 'Usuário não encontrado');
      }
      return this.converterUserAdminForResponse(searchUserAdmin);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async update(
    userAdmin: UserAdmin,
    token: string
  ): Promise<UserAdminResponse> {
    try {
      const oldValue = await this.searchByIdForLog(userAdmin.id);

      const validateResult = this.validateAlterUserAdmin(userAdmin);
      if (!validateResult.success) {
        const zodIssues: ZodIssue[] = [];
        validateResult.error.forEach((errorItem) => {
          zodIssues.push(...errorItem.errors);
        });
        throw new ZodError(zodIssues);
      }
      const newValue = await userAdminRepository.update(userAdmin);
      await this.createLogs(oldValue, newValue, 'update', token);
      return this.converterUserAdminForResponse(newValue);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async alterPassword(
    alterPassword: AlterPasswordRequest,
    token: string
  ): Promise<void> {
    try {
      const oldValue = await this.searchByIdForLog(alterPassword.id);
      const validateResult = schemaAlterPassword.safeParse(alterPassword);
      if (!validateResult.success) {
        throw new ZodError(validateResult.error.errors);
      }
      alterPassword.password = await this.encryptPassword(
        alterPassword.password
      );
      const newValue = await userAdminRepository.alterPassword(alterPassword);
      await this.createLogs(oldValue, newValue, 'alterPassword', token);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async changeStatus(idUserAdmin: number, token: string): Promise<void> {
    try {
      const oldValue = await this.searchByIdForLog(idUserAdmin);
      const changeStatusUserAdmin: ChangeStatus = {
        id: idUserAdmin,
        active: !oldValue.active
      };
      const newValue = await userAdminRepository.changeStatus(
        changeStatusUserAdmin
      );
      await this.createLogs(oldValue, newValue, 'changeStatus', token);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }

  private converterUserAdminForResponse(
    userAdmin: UserAdmin
  ): UserAdminResponse {
    const userAdminResponse: UserAdminResponse = {
      id: userAdmin.id,
      username: userAdmin.username,
      name: userAdmin.name,
      email: userAdmin.email,
      role: userAdmin.role,
      active: userAdmin.active,
      last_login: userAdmin.last_login
    };
    return userAdminResponse;
  }

  private converterAllUserAdminForResponse(
    userAdmin: UserAdmin[]
  ): UserAdminResponse[] {
    const userAdminResponse: UserAdminResponse[] = userAdmin.map(
      (user: UserAdmin) => {
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
          last_login: user.last_login
        };
      }
    );
    return userAdminResponse;
  }

  private validateAlterUserAdmin(userAdmin: UserAdmin): ValidUserUpdate {
    const validationResult: ValidUserUpdate = {
      success: true,
      error: []
    };
    if (userAdmin.name) {
      const valiudUser = schemaUserAdminName.safeParse(userAdmin);
      if (!valiudUser.success)
        validationResult.error.push({ errors: valiudUser.error.errors });
    }
    if (userAdmin.username) {
      const valiudUser = schemaUserAdminUsername.safeParse(userAdmin);
      if (!valiudUser.success)
        validationResult.error.push({ errors: valiudUser.error.errors });
    }
    if (userAdmin.email) {
      const valiudUser = schemaUserAdminEmail.safeParse(userAdmin);
      if (!valiudUser.success)
        validationResult.error.push({ errors: valiudUser.error.errors });
    }
    if (userAdmin.role) {
      const valiudUser = schemaUserAdminRole.safeParse(userAdmin);
      if (!valiudUser.success)
        validationResult.error.push({ errors: valiudUser.error.errors });
    }

    if (validationResult.error.length !== 0) {
      validationResult.success = false;
    }
    return validationResult;
  }

  private async createLogs(
    oldValue: UserAdmin,
    newValue: UserAdmin,
    action: string,
    token: string
  ) {
    try {
      const log: LogsUserAdmin = {
        id: 0,
        user_admin_id: newValue.id,
        action: action,
        old_value: oldValue,
        new_value: newValue,
        date: new Date(),
        user_id: 0
      };
      await logsServices.createLogUserAdmin(log, token);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }
}

export default new UserAdminService();
