import request from 'supertest';
import app from '../../app';
import userAdminServices from '../../services/userAdminServices';
import { HttpError } from '../../errorHandling/custonError';
import authorization from '../authorization';
import UserAdmin from '../../model/userAdmin';

jest.mock('../../services/userAdminServices');

describe('userAdminRouter', () => {
  let usersDb: UserAdmin[];

  beforeAll(() => {
    usersDb = [];

    (userAdminServices.createUserAdmin as jest.Mock).mockImplementation(
      (userAdmin: UserAdmin) => {
        const existingUser = usersDb.find(
          (u) => u.username === userAdmin.username
        );
        if (existingUser) {
          return Promise.reject(new HttpError(400, 'Usuario já cadastrado!'));
        } else {
          const newUser = { ...userAdmin, id: usersDb.length + 1 };
          usersDb.push(newUser);
          return Promise.resolve(newUser);
        }
      }
    );

    (userAdminServices.searchAll as jest.Mock).mockImplementation(() => {
      return Promise.resolve(usersDb);
    });

    (userAdminServices.searchById as jest.Mock).mockImplementation(
      (id: number) => {
        const user = usersDb.find((u) => u.id === id);
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.reject(new HttpError(400, 'Usuário não encontrado'));
        }
      }
    );

    (userAdminServices.searchByUserName as jest.Mock).mockImplementation(
      (username: string) => {
        const user = usersDb.find((u) => u.username === username);
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.reject(new HttpError(400, 'Usuário não encontrado'));
        }
      }
    );

    (userAdminServices.update as jest.Mock).mockImplementation(
      (userAdmin: UserAdmin) => {
        const user = usersDb.find((u) => u.id === userAdmin.id);
        if (user) {
          user.email = userAdmin.email;
          user.name = userAdmin.name;
          user.role = userAdmin.role;
          user.username = userAdmin.username;
          return Promise.resolve(user);
        } else {
          return Promise.reject(new HttpError(400, 'Usuário não encontrado'));
        }
      }
    );

    (userAdminServices.alterPassword as jest.Mock).mockImplementation(
      (userAdmin: UserAdmin) => {
        const user = usersDb.find((u) => u.id === userAdmin.id);
        if (user) {
          return Promise.resolve();
        } else {
          return Promise.reject(new HttpError(400, 'Usuário não encontrado'));
        }
      }
    );

    (userAdminServices.delete as jest.Mock).mockImplementation((id: number) => {
      const index = usersDb.findIndex((u) => u.id === id);
      if (index !== -1) {
        usersDb.splice(index, 1);
        return Promise.resolve();
      } else {
        return Promise.reject(new HttpError(400, 'Usuário não encontrado'));
      }
    });
  });

  beforeEach(() => {
    usersDb = [];
  });

  describe('POST /useradmin/createuseradmin', () => {
    it('should create a new user admin and return 200 status', async () => {
      const mockUserAdmin = {
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      const response = await request(app)
        .post('/useradmin/createuseradmin')
        .send(mockUserAdmin)
        .set('Authorization', authorization);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...mockUserAdmin,
        id: expect.any(Number)
      });
    });

    it('should return an error if user admin already exists', async () => {
      const mockUserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      usersDb.push({ ...mockUserAdmin, id: 1 });

      const response = await request(app)
        .post('/useradmin/createuseradmin')
        .send(mockUserAdmin)
        .set('Authorization', authorization);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Usuario já cadastrado!'
      });
    });
  });

  describe('GET /useradmin/searchall', () => {
    it('should get all user admin and return 200 status', async () => {
      const mockUserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      await userAdminServices.createUserAdmin(mockUserAdmin);

      const response = await request(app)
        .get('/useradmin/searchall')
        .set('Authorization', authorization);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([expect.objectContaining(mockUserAdmin)]);
    });

    it('should return 400 status on generic error', async () => {
      (userAdminServices.searchAll as jest.Mock).mockRejectedValueOnce(
        new Error('Generic error')
      );

      const response = await request(app)
        .get('/useradmin/searchall')
        .set('Authorization', authorization);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Generic error' });
    });
  });

  describe('GET /useradmin/searchbyid/:id', () => {
    it('should get user admin by id and return 200 status', async () => {
      const mockUserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      const createdUser =
        await userAdminServices.createUserAdmin(mockUserAdmin);

      const response = await request(app)
        .get(`/useradmin/searchbyid/${createdUser.id}`)
        .set('Authorization', authorization);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(createdUser);
    });

    it('should return 404 if user admin not found', async () => {
      const mockUserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      await userAdminServices.createUserAdmin(mockUserAdmin);

      const response = await request(app)
        .get('/useradmin/searchbyid/10')
        .set('Authorization', authorization);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Usuário não encontrado' });
    });
  });

  describe('GET /useradmin/searchbyusername/:username', () => {
    it('should get user admin by username and return 200 status', async () => {
      const mockUserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      const createdUser =
        await userAdminServices.createUserAdmin(mockUserAdmin);

      const response = await request(app)
        .get(`/useradmin/searchbyusername/${createdUser.username}`)
        .set('Authorization', authorization);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(createdUser);
    });

    it('should return 404 if user admin not found', async () => {
      const mockUserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      await userAdminServices.createUserAdmin(mockUserAdmin);

      const response = await request(app)
        .get('/useradmin/searchbyusername/misael.abc')
        .set('Authorization', authorization);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Usuário não encontrado' });
    });
  });

  describe('PUT /useradmin/update', () => {
    it('should update user admin and return 200 status', async () => {
      const mockUserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      await userAdminServices.createUserAdmin(mockUserAdmin);

      const mockUpdateUserAdmin = {
        id: 1,
        name: 'Misael Batista Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'misael@vivertecnologia.com.br',
        role: 'admin'
      };

      const update = await userAdminServices.update(mockUpdateUserAdmin);

      const response = await request(app)
        .put('/useradmin/update')
        .send(mockUpdateUserAdmin)
        .set('Authorization', authorization);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(update);
    });

    it('should return 400 status on generic error', async () => {
      (userAdminServices.update as jest.Mock).mockRejectedValueOnce(
        new Error('Generic error')
      );

      const response = await request(app)
        .put('/useradmin/update')
        .send({
          id: 1,
          name: 'Erro',
          username: 'erro.user',
          password: 'Erro@123',
          email: 'erro@vivertecnologia.com.br',
          role: 'admin'
        })
        .set('Authorization', authorization);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Generic error' });
    });
  });

  describe('PUT /useradmin/alterpassword', () => {
    it('should update user admin and return 200 status', async () => {
      const mockUserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      await userAdminServices.createUserAdmin(mockUserAdmin);

      const mockUpdateUserAdmin = {
        id: 1,
        password: 'Misael@1234'
      };

      await userAdminServices.alterPassword(mockUpdateUserAdmin);

      const response = await request(app)
        .put('/useradmin/alterpassword')
        .send(mockUpdateUserAdmin)
        .set('Authorization', authorization);

      expect(response.status).toBe(200);
    });

    it('should return 400 status on generic error', async () => {
      (userAdminServices.alterPassword as jest.Mock).mockRejectedValueOnce(
        new Error('Generic error')
      );

      const response = await request(app)
        .put('/useradmin/alterpassword')
        .send({
          id: 1,
          password: 'Erro@1234'
        })
        .set('Authorization', authorization);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Generic error' });
    });
  });

  describe('DELETE /useradmin/delete/:id', () => {
    it('should delete user admin and return 200 status', async () => {
      const mockUserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      await userAdminServices.createUserAdmin(mockUserAdmin);

      const response = await request(app)
        .delete(`/useradmin/delete/${mockUserAdmin.id}`)
        .set('Authorization', authorization);

      expect(response.status).toBe(200);
    });

    it('should return 404 if user admin not found', async () => {
      const response = await request(app)
        .delete('/useradmin/delete/10')
        .set('Authorization', authorization);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Usuário não encontrado' });
    });
  });
});
