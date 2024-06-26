import request from 'supertest';
import app from '../../app';
import { LoginAdmin } from '../../model/userAdmin';
import loginAdminServices from '../../services/loginAdminServices';

jest.mock('../../services/loginAdminServices');

describe('AuthUserAdmin', () => {
  const mockToken = 'mock-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token when login is successful', async () => {
    const mockLogin: LoginAdmin = {
      username: 'admin',
      password: 'admin123'
    };

    (loginAdminServices.login as jest.Mock).mockResolvedValue(mockToken);

    const response = await request(app)
      .post('/loginadmin/login')
      .send(mockLogin);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockToken);
  });

  it('should return 400 and an error message when login fails', async () => {
    const mockLogin: LoginAdmin = {
      username: 'admin',
      password: 'wrongpassword'
    };

    (loginAdminServices.login as jest.Mock).mockRejectedValue(
      new Error('Invalid credentials')
    );

    const response = await request(app)
      .post('/loginadmin/login')
      .send(mockLogin);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid credentials' });
  });
});
