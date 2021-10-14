import healthHandler from './handlers/health';
import loginHandler from './handlers/login';

export const applyServerRoutes = (app) => {
  app.get('/health', healthHandler);
  app.post('/login', loginHandler);
};
