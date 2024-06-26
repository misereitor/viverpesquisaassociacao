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
  '/useradmin/searchbyid/:id',
  '/useradmin/searchbyusername/:username',
  '/useradmin/update',
  '/useradmin/alterpassword',
  '/useradmin/delete/:id'
];

const adminRoutesRegex = adminRoutes.map(
  (route) => new RegExp(`^${route.replace(/:[^\s/]+/g, '([^/]+)')}$`)
);

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

    const isAdminRoute = adminRoutesRegex.some((regex) => regex.test(pathname));
    if (!isAdminRoute) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  });
};

export default authMiddlewareUserAdmin;
