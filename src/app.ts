import express, { Application } from 'express';
import { routerAdmin } from './router/userAdmin.router';
import cors, { CorsOptions } from 'cors';
import { routerAuthAdmin } from './router/authAdmin.router';
import { routerCategory } from './router/category.router';
import { routerCompany } from './router/company.router';

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: 'http://localhost:5000'
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/useradmin', routerAdmin);
app.use('/loginadmin', routerAuthAdmin);
app.use('/category', routerCategory);
app.use('/company', routerCompany);

export default app;
