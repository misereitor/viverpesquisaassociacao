import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import secretKey from '../config/secretKey.config';

interface Decoded {
  id: number;
  username: string;
  roles: string;
  iat: number;
  exp: number;
}

const adminRoutes = [
  '/useradmin/searchall',
  '/useradmin/createuseradmin',
  '/useradmin/searchbyid',
  '/useradmin/searchbyusername',
  '/useradmin/update',
  '/useradmin/alterpassword',
  '/useradmin/delete'
];

const authMiddlewareUserAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pathname = req.originalUrl;
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decodedTransform = decoded as Decoded;
    if (decodedTransform.roles != 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!adminRoutes.includes(pathname)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  });
};

export default authMiddlewareUserAdmin;
