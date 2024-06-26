import userAdminServices from '../../services/userAdminServices';
import userAdminRepository from '../../repositiry/userAdminRepository';
import UserAdmin, { UserAdminResponse } from '../../model/userAdmin';
import { HttpError } from '../../errorHandling/custonError';
import * as bcrypt from 'bcrypt';
import { schemaAddUserAdmin } from '../../schema/validationUserAdmin';

jest.mock('../../repositiry/userAdminRepository');
jest.mock('bcrypt', () => ({
  hash: jest
    .fn()
    .mockImplementation((password: string) => Promise.resolve(password))
}));

describe('userAdminServices', () => {
  describe('createUserAdmin', () => {
    it('should throw an error if the user admin already exists', async () => {
      const mockUserAdmin: UserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@123',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      (userAdminRepository.searchByUserName as jest.Mock).mockResolvedValue(
        mockUserAdmin
      );

      await expect(
        userAdminServices.createUserAdmin(mockUserAdmin)
      ).rejects.toThrow(HttpError);
      expect(userAdminRepository.searchByUserName).toHaveBeenCalledWith(
        mockUserAdmin.username
      );
    });

    it('should create a new user admin when data is valid', async () => {
      const mockUserAdmin: UserAdmin = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        password: 'Misael@1023',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      const mockUserAdminResponse: UserAdminResponse = {
        id: 1,
        name: 'Misael Miranda',
        username: 'misael.miranda',
        email: 'teste@vivertecnologia.com.br',
        role: 'admin'
      };

      (userAdminRepository.searchByUserName as jest.Mock).mockResolvedValue(
        null
      );
      (userAdminRepository.save as jest.Mock).mockResolvedValue(
        mockUserAdmin.id
      );

      await expect(
        userAdminServices.createUserAdmin(mockUserAdmin)
      ).resolves.toEqual(mockUserAdminResponse);
      expect(() => {
        schemaAddUserAdmin.parse(mockUserAdmin);
      }).not.toThrow();
      expect(userAdminRepository.searchByUserName).toHaveBeenCalledWith(
        mockUserAdmin.username
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(expect.any(String), 10);
      expect(userAdminRepository.save).toHaveBeenCalledWith({
        ...mockUserAdmin
      });
    });

    it('should throw ZodError if validation fails', async () => {
      const mockUserAdmin = {
        id: 1,
        username: 'newuser',
        name: 'New User',
        email: 'invalidemail', // Email inválido
        role: 'admin',
        password: 'Password@123'
      };

      await expect(
        userAdminServices.createUserAdmin(mockUserAdmin)
      ).rejects.toThrow(HttpError);
    });
  });
});
