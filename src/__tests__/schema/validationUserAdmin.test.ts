import {
  schemaAddUserAdmin,
  schemaAlterPassword,
  schemaUserAdminUsername,
  schemaUserAdminName,
  schemaUserAdminEmail,
  schemaUserAdminRole
} from '../../schema/validationUserAdmin';

// Test for schemaAddUserAdmin
describe('schemaAddUserAdmin', () => {
  it('should pass with valid input', () => {
    const validInput = {
      username: 'validUser',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'ValidPass@123'
    };

    expect(() => schemaAddUserAdmin.parse(validInput)).not.toThrow();
  });

  it('should fail with invalid username', () => {
    const invalidInput = {
      username: 'invalid@user',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'ValidPass@123'
    };

    expect(() => schemaAddUserAdmin.parse(invalidInput)).toThrow(
      'Nome de login não pode ter caracteres especiais'
    );
  });

  it('should fail with incomplete name', () => {
    const invalidInput = {
      username: 'validUser',
      name: 'John',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'ValidPass@123'
    };

    expect(() => schemaAddUserAdmin.parse(invalidInput)).toThrow(
      'Coloque o seu nome completo!'
    );
  });

  it('should fail with name containing numbers', () => {
    const invalidInput = {
      username: 'validUser',
      name: 'John Doe2',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'ValidPass@123'
    };

    expect(() => schemaAddUserAdmin.parse(invalidInput)).toThrow(
      'Nome não pode ter símbolos ou números'
    );
  });

  it('should fail with invalid email', () => {
    const invalidInput = {
      username: 'validUser',
      name: 'John Doe',
      email: 'invalid-email',
      role: 'admin',
      password: 'ValidPass@123'
    };

    expect(() => schemaAddUserAdmin.parse(invalidInput)).toThrow(
      'Insira um e-mail válido'
    );
  });

  it('should fail with weak password', () => {
    const invalidInput = {
      username: 'validUser',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'Mis@12'
    };

    expect(() => schemaAddUserAdmin.parse(invalidInput)).toThrow(
      'A senha tem que ter ao menos 8 caracteres'
    );
  });

  it('should fail with password missing special character', () => {
    const invalidInput = {
      username: 'validUser',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'Valid123'
    };

    expect(() => schemaAddUserAdmin.parse(invalidInput)).toThrow(
      'A senha precisa ter um caracter como @ !'
    );
  });

  it('should fail with password missing uppercase letter', () => {
    const invalidInput = {
      username: 'validUser',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'validpass@123'
    };

    expect(() => schemaAddUserAdmin.parse(invalidInput)).toThrow(
      'A senha precisa ter uma letra maiúscula'
    );
  });

  it('should fail with password missing lowercase letter', () => {
    const invalidInput = {
      username: 'validUser',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'VALIDPASS@123'
    };

    expect(() => schemaAddUserAdmin.parse(invalidInput)).toThrow(
      'A senha precisa ter uma letra minúscula'
    );
  });
});

// Test for schemaAlterPassword
describe('schemaAlterPassword', () => {
  it('should pass with valid password', () => {
    const validInput = {
      password: 'ValidPass@123'
    };

    expect(() => schemaAlterPassword.parse(validInput)).not.toThrow();
  });

  it('should fail with weak password', () => {
    const invalidInput = {
      password: 'Mis@12'
    };

    expect(() => schemaAlterPassword.parse(invalidInput)).toThrow(
      'A senha tem que ter ao menos 8 caracteres'
    );
  });

  it('should fail with password missing special character', () => {
    const invalidInput = {
      password: 'Valid123'
    };

    expect(() => schemaAlterPassword.parse(invalidInput)).toThrow(
      'A senha precisa ter um caracter como @ !'
    );
  });

  it('should fail with password missing uppercase letter', () => {
    const invalidInput = {
      password: 'validpass@123'
    };

    expect(() => schemaAlterPassword.parse(invalidInput)).toThrow(
      'A senha precisa ter uma letra maiúscula'
    );
  });

  it('should fail with password missing lowercase letter', () => {
    const invalidInput = {
      password: 'VALIDPASS@123'
    };

    expect(() => schemaAlterPassword.parse(invalidInput)).toThrow(
      'A senha precisa ter uma letra minúscula'
    );
  });
});

// Test for schemaUserAdminProfile
describe('schemaUserAdminProfile', () => {
  it('should pass with valid input', () => {
    const validInput = {
      username: 'validUser',
      name: 'John Doe',
      email: 'john.doe@example.com'
    };

    expect(() => schemaUserAdminUsername.parse(validInput)).not.toThrow();
  });

  it('should pass with username valid', () => {
    const validInput = {
      username: 'validuser'
    };

    expect(() => schemaUserAdminUsername.parse(validInput)).not.toThrow();
  });

  it('should pass with name valid', () => {
    const validInput = {
      name: 'valid name'
    };

    expect(() => schemaUserAdminName.parse(validInput)).not.toThrow();
  });

  it('should pass with e-mail valid', () => {
    const validInput = {
      email: 'valid@email.com'
    };

    expect(() => schemaUserAdminEmail.parse(validInput)).not.toThrow();
  });

  it('should pass with role valid', () => {
    const validInput = {
      role: 'validrole'
    };

    expect(() => schemaUserAdminRole.parse(validInput)).not.toThrow();
  });

  it('should fail with invalid username', () => {
    const invalidInput = {
      username: 'invalid@user'
    };

    expect(() => schemaUserAdminUsername.parse(invalidInput)).toThrow(
      'Nome de login não pode ter caracteres especiais'
    );
  });

  it('should fail with incomplete name', () => {
    const invalidInput = {
      name: 'John'
    };

    expect(() => schemaUserAdminName.parse(invalidInput)).toThrow(
      'Coloque o seu nome completo!'
    );
  });

  it('should fail with name containing numbers', () => {
    const invalidInput = {
      name: 'John Doe2'
    };

    expect(() => schemaUserAdminName.parse(invalidInput)).toThrow(
      'Nome não pode ter símbolos ou números'
    );
  });

  it('should fail with invalid email', () => {
    const invalidInput = {
      email: 'invalid-email'
    };

    expect(() => schemaUserAdminEmail.parse(invalidInput)).toThrow(
      'Insira um e-mail válido'
    );
  });

  it('should fail with invalid role', () => {
    const invalidInput = {
      role: 123
    };

    expect(() => schemaUserAdminRole.parse(invalidInput)).toThrow(
      'Expected string, received number'
    );
  });

  it('should fail with valid role', () => {
    const invalidInput = {
      role: 'admin'
    };

    expect(() => schemaUserAdminRole.parse(invalidInput)).not.toThrow();
  });
});
