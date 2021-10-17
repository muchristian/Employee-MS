import authRoutes from './auth.routes';
import employeeRoutes from './employee.routes';
import express from 'express';
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/employee', employeeRoutes)



export default apiRouter;
