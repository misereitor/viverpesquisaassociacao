import UserAdmin, {
  AlterPasswordRequest,
  LoginAdmin,
  UserAdminResponse
} from '../../model/userAdmin';

describe('UserAdmin Model', () => {
  it('should create a valid UserAdmin object', () => {
    const userAdmin: UserAdmin = {
      id: 1,
      name: 'Test User',
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
      role: 'admin'
    };

    expect(userAdmin).toBeDefined();
    expect(userAdmin.id).toBe(1);
    expect(userAdmin.name).toBe('Test User');
    expect(userAdmin.username).toBe('testuser');
    expect(userAdmin.password).toBe('password123');
    expect(userAdmin.email).toBe('test@example.com');
    expect(userAdmin.role).toBe('admin');
  });

  it('should create a valid UserAdminResponse object', () => {
    const userAdminResponse: UserAdminResponse = {
      id: 1,
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin'
    };

    expect(userAdminResponse).toBeDefined();
    expect(userAdminResponse.id).toBe(1);
    expect(userAdminResponse.name).toBe('Test User');
    expect(userAdminResponse.username).toBe('testuser');
    expect(userAdminResponse.email).toBe('test@example.com');
    expect(userAdminResponse.role).toBe('admin');
  });

  it('should create a valid AlterPasswordRequest object', () => {
    const alterPasswordRequest: AlterPasswordRequest = {
      id: 1,
      password: 'newpassword123'
    };

    expect(alterPasswordRequest).toBeDefined();
    expect(alterPasswordRequest.id).toBe(1);
    expect(alterPasswordRequest.password).toBe('newpassword123');
  });

  it('should create a valid LoginAdmin object', () => {
    const loginAdmin: LoginAdmin = {
      username: 'testuser',
      password: 'password123'
    };

    expect(loginAdmin).toBeDefined();
    expect(loginAdmin.username).toBe('testuser');
    expect(loginAdmin.password).toBe('password123');
  });
});
