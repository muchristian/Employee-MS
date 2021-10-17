import express, {Router} from 'express';
import apis from './api/index';
const routes = express.Router();
routes.use('/api', apis);
export default routes;
