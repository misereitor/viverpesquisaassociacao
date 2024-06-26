import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authMiddlewareUserAdmin from '../../middlewares/authMiddleware';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('authMiddlewareUserAdmin', () => {
  let req: Partial<Request> & {
    headers: { [key: string]: string | undefined };
  };
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      originalUrl: '',
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', () => {
    req.originalUrl = '/useradmin/searchall';

    authMiddlewareUserAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.originalUrl = '/useradmin/searchall';
    req.headers['authorization'] = 'invalidToken';

    (verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    authMiddlewareUserAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not an admin', () => {
    req.originalUrl = '/useradmin/searchall';
    req.headers['authorization'] = 'validToken';

    (verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, {
        id: 1,
        username: 'testuser',
        roles: 'user',
        iat: 0,
        exp: 0
      });
    });

    authMiddlewareUserAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user is an admin and route is protected', () => {
    req.originalUrl = '/useradmin/searchall';
    req.headers['authorization'] = 'validToken';

    (verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, {
        id: 1,
        username: 'admin',
        roles: 'admin',
        iat: 0,
        exp: 0
      });
    });

    authMiddlewareUserAdmin(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 401 if user is an admin but route is not protected', () => {
    req.originalUrl = '/otherroute';
    req.headers['authorization'] = 'validToken';

    (verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, {
        id: 1,
        username: 'admin',
        roles: 'admin',
        iat: 0,
        exp: 0
      });
    });

    authMiddlewareUserAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle error thrown in verify callback', () => {
    req.originalUrl = '/useradmin/searchall';
    req.headers['authorization'] = 'validToken';

    (verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error('Some error'), null);
    });

    authMiddlewareUserAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle non-string route params correctly', () => {
    req.originalUrl = '/useradmin/searchbyid/123';
    req.headers['authorization'] = 'validToken';

    (verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, {
        id: 1,
        username: 'admin',
        roles: 'admin',
        iat: 0,
        exp: 0
      });
    });

    authMiddlewareUserAdmin(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
