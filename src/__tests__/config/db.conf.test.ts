import { createConnection } from '../../config/db.config';
import mysql from 'mysql2/promise';

jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn()
}));

describe('createConnection', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should create a connection with the correct config', async () => {
    process.env.HOST_DB = 'localhost';
    process.env.USER_DB = 'root';
    process.env.PASSWORD_DB = 'password';
    process.env.NAME_DB = 'test_db';

    const mockConnection = {};
    (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);

    const connection = await createConnection();

    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'test_db'
    });
    expect(connection).toBe(mockConnection);
  });

  it('should throw an error if the connection fails', async () => {
    (mysql.createConnection as jest.Mock).mockRejectedValue(
      new Error('Connection failed')
    );

    await expect(createConnection()).rejects.toThrow('Connection failed');
  });
});
