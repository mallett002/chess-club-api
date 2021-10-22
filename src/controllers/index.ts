import passport from 'passport';

import healthHandler from './handlers/health';
import loginHandler from './handlers/login';


export const applyServerRoutes = (app) => {
  app.get('/health', passport.authenticate('jwt', {session: false}), healthHandler);
  app.post('/login', loginHandler);
};
