import healthHandler from './handlers/health';

export const applyServerRoutes = (app) => {
  app.get('/health', healthHandler);
};
