import mysql from 'mysql2/promise';
import UserAdminRepository from '../../repositiry/userAdminRepository';
import { HttpError } from '../../errorHandling/custonError';
import UserAdmin, { AlterPasswordRequest } from '../../model/userAdmin';

jest.mock('mysql2/promise');

describe('UserAdminRepository', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockConnection: any;
  let mockConsoleError: jest.SpyInstance;
  beforeAll(() => {
    // Intercepta console.error
    mockConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn()
    };
    (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restaura o comportamento original de console.error
    mockConsoleError.mockRestore();
  });

  describe('save', () => {
    it('should save a user and return the insertId', async () => {
      mockConnection.execute.mockResolvedValue([{ insertId: 1 }]);
      const userAdmin: UserAdmin = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        role: 'admin'
      };

      const result = await UserAdminRepository.save(userAdmin);
      expect(result).toBe(1);
      expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), [
        userAdmin.name,
        userAdmin.username,
        userAdmin.password,
        userAdmin.email,
        userAdmin.role
      ]);
    });

    it('should throw HttpError on failure', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Database error'));
      const userAdmin: UserAdmin = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        role: 'admin'
      };

      await expect(UserAdminRepository.save(userAdmin)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('searchAll', () => {
    it('should return all users', async () => {
      const users: UserAdmin[] = [
        {
          id: 1,
          name: 'Test User',
          username: 'testuser',
          password: 'password123',
          email: 'test@example.com',
          role: 'admin'
        }
      ];
      mockConnection.execute.mockResolvedValue([users]);

      const result = await UserAdminRepository.searchAll();
      expect(result).toEqual(users);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT * FROM user_admin'
      );
    });

    it('should throw HttpError on failure', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Database error'));
      await expect(UserAdminRepository.searchAll()).rejects.toThrow(HttpError);
    });
  });

  describe('searchById', () => {
    it('should return a user by ID', async () => {
      const user: UserAdmin = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        role: 'admin'
      };
      mockConnection.execute.mockResolvedValue([[user]]);

      const result = await UserAdminRepository.searchById(1);
      expect(result).toEqual(user);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT * FROM user_admin WHERE id = (?)',
        [1]
      );
    });

    it('should throw HttpError on failure', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Database error'));
      await expect(UserAdminRepository.searchById(1)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('searchByUserName', () => {
    it('should return a user by username', async () => {
      const user: UserAdmin = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        role: 'admin'
      };
      mockConnection.execute.mockResolvedValue([[user]]);

      const result = await UserAdminRepository.searchByUserName('testuser');
      expect(result).toEqual(user);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT * FROM user_admin WHERE username LIKE (?)',
        ['testuser']
      );
    });

    it('should throw HttpError on failure', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Database error'));
      await expect(
        UserAdminRepository.searchByUserName('testuser')
      ).rejects.toThrow(HttpError);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const user: UserAdmin = {
        id: 1,
        name: 'Updated User',
        username: 'updateduser',
        password: 'password123',
        email: 'updated@example.com',
        role: 'admin'
      };
      mockConnection.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      mockConnection.execute.mockResolvedValueOnce([[user]]);

      const result = await UserAdminRepository.update(user);
      expect(result).toEqual(user);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it('should throw HttpError on failure', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Database error'));
      const user: UserAdmin = {
        id: 1,
        name: 'Updated User',
        username: 'updateduser',
        password: 'password123',
        email: 'updated@example.com',
        role: 'admin'
      };

      await expect(UserAdminRepository.update(user)).rejects.toThrow(HttpError);
    });
  });

  describe('alterPassword', () => {
    it('should update the user password', async () => {
      mockConnection.execute.mockResolvedValue({});

      const alterPasswordRequest: AlterPasswordRequest = {
        id: 1,
        password: 'newpassword123'
      };

      await UserAdminRepository.alterPassword(alterPasswordRequest);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'UPDATE user_admin SET password = ? WHERE id = ?',
        [alterPasswordRequest.password, alterPasswordRequest.id]
      );
    });

    it('should throw HttpError on failure', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Database error'));
      const alterPasswordRequest: AlterPasswordRequest = {
        id: 1,
        password: 'newpassword123'
      };

      await expect(
        UserAdminRepository.alterPassword(alterPasswordRequest)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      mockConnection.execute.mockResolvedValue({});

      await UserAdminRepository.delete(1);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'DELETE FROM user_admin WHERE id = ?',
        [1]
      );
    });

    it('should throw HttpError on failure', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Database error'));
      await expect(UserAdminRepository.delete(1)).rejects.toThrow(HttpError);
    });
  });
});
