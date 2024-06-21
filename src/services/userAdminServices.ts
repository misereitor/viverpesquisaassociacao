import UserAdmin, {
  AlterPasswordRequest,
  UserAdminResponse
} from '../model/userAdmin';
import * as bcrypt from 'bcrypt';
import userAdminRepository from '../repositiry/userAdminRepository';
import {
  schemaAddUserAdmin,
  schemaAlterPassword,
  schemaUserAdminProfile
} from '../schema/validationUserAdmin';
import { ZodError } from 'zod';
import { HttpError } from '../errorHandling/custonError';

interface IUserAdminService {
  createUserAdmin(userAdmin: UserAdmin): Promise<UserAdminResponse>;
  searchAll(): Promise<UserAdminResponse[]>;
  searchById(idUserAdmin: number): Promise<UserAdminResponse>;
  searchByUserName(userName: string): Promise<UserAdminResponse>;
  update(userAdmin: UserAdmin): Promise<UserAdminResponse>;
  alterPassword(alterPassword: AlterPasswordRequest): Promise<void>;
  delete(idUserAdmin: number): Promise<void>;
}

class UserAdminService implements IUserAdminService {
  public async createUserAdmin(
    userAdmin: UserAdmin
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
      return this.converterUserAdminForResponse(userAdmin);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((e) => e.message).join(', ');
        throw new HttpError(406, `Validation error: ${errorMessages}`);
      }
      throw new HttpError(403, `${error}`);
    }
  }

  public async searchAll(): Promise<UserAdminResponse[]> {
    try {
      const searchUserAdmin = await userAdminRepository.searchAll();
      if (!searchUserAdmin) {
        throw new HttpError(404, 'Usuário não encontrado');
      }
      return this.converterAllUserAdminForResponse(searchUserAdmin);
    } catch (error) {
      throw new HttpError(403, `${error}`);
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
      throw new HttpError(403, `${error}`);
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
      throw new HttpError(403, `${error}`);
    }
  }

  public async update(userAdmin: UserAdmin): Promise<UserAdminResponse> {
    try {
      await this.searchById(userAdmin.id);

      const validateResult = schemaUserAdminProfile.safeParse(userAdmin);
      if (!validateResult.success) {
        throw new ZodError(validateResult.error.errors);
      }
      const update = await userAdminRepository.update(userAdmin);
      return this.converterUserAdminForResponse(update);
    } catch (error) {
      throw new HttpError(403, `${error}`);
    }
  }

  public async alterPassword(
    alterPassword: AlterPasswordRequest
  ): Promise<void> {
    try {
      await this.searchById(alterPassword.id);
      const validateResult = schemaAlterPassword.safeParse(alterPassword);
      if (!validateResult.success) {
        throw new ZodError(validateResult.error.errors);
      }
      alterPassword.password = await this.encryptPassword(
        alterPassword.password
      );
      await userAdminRepository.alterPassword(alterPassword);
    } catch (error) {
      throw new HttpError(403, `${error}`);
    }
  }

  public async delete(idUserAdmin: number): Promise<void> {
    try {
      await this.searchById(idUserAdmin);
      await userAdminRepository.delete(idUserAdmin);
    } catch (error) {
      throw new HttpError(403, `${error}`);
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
      role: userAdmin.role
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
          role: user.role
        };
      }
    );
    return userAdminResponse;
  }
}

export default new UserAdminService();
