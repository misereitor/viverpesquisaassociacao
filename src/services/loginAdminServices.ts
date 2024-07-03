import { sign } from 'jsonwebtoken';
import { HttpError } from '../errorHandling/custonError';
import { LoginAdmin } from '../model/userAdmin';
import userAdminRepository from '../repositiry/userAdminRepository';
import * as bcript from 'bcrypt';
import secretKey from '../config/secretKey.config';

interface ILoginAdminServices {
  login(login: LoginAdmin): Promise<string>;
}

class LoginAdminServices implements ILoginAdminServices {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = secretKey;
  }

  public async login(login: LoginAdmin): Promise<string> {
    try {
      const userAdmin = await userAdminRepository.searchByUserName(
        login.username
      );
      if (!userAdmin) {
        throw new HttpError(404, 'Login ou senha inválidos');
      }
      const isMatch = await bcript.compare(login.password, userAdmin.password);
      if (!isMatch) throw new HttpError(404, 'Login ou senha inválidos');

      const date = new Date();
      userAdmin.last_login = date;
      await userAdminRepository.update(userAdmin);

      const token = sign(
        {
          id: userAdmin.id,
          username: userAdmin.username,
          roles: userAdmin.role
        },
        this.secretKey,
        {
          expiresIn: '30d'
        }
      );
      return token;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }
}

export default new LoginAdminServices();
