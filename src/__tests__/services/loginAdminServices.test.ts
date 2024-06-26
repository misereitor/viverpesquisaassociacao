import loginAdminServices from '../../services/loginAdminServices';
import userAdminRepository from '../../repositiry/userAdminRepository';
import { HttpError } from '../../errorHandling/custonError';
import * as bcrypt from 'bcrypt';

jest.mock('../../repositiry/userAdminRepository');
jest.mock('bcrypt');

describe('LoginAdminServices', () => {
  describe('login', () => {
    const mockUserAdmin = {
      id: 1,
      username: 'testuser',
      password: '$2b$10$TJN1Pfi1P2bY/3G6kY3HTeJUkyNzTWG4cOCXSDYZ..Opl.CBi4zeO',
      role: 'admin'
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should login successfully', async () => {
      (userAdminRepository.searchByUserName as jest.Mock).mockResolvedValue(
        mockUserAdmin
      );

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const loginData = {
        username: 'testuser',
        password: 'testpassword'
      };
      const token = await loginAdminServices.login(loginData);

      expect(token).toBeTruthy();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'testpassword',
        mockUserAdmin.password
      );
    });

    it('should throw HttpError when user is not found', async () => {
      (userAdminRepository.searchByUserName as jest.Mock).mockResolvedValue(
        null
      );

      const loginData = {
        username: 'nonexistentuser',
        password: 'testpassword'
      };

      await expect(loginAdminServices.login(loginData)).rejects.toThrow(
        HttpError
      );
      expect(userAdminRepository.searchByUserName).toHaveBeenCalledWith(
        'nonexistentuser'
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw HttpError when password is incorrect', async () => {
      (userAdminRepository.searchByUserName as jest.Mock).mockResolvedValue(
        mockUserAdmin
      );

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const loginData = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      await expect(loginAdminServices.login(loginData)).rejects.toThrow(
        HttpError
      );
      expect(userAdminRepository.searchByUserName).toHaveBeenCalledWith(
        'testuser'
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        mockUserAdmin.password
      );
    });
  });
});
