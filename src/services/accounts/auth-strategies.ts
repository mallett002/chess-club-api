import passport from 'passport';
import {Strategy as JwtStrategy} from 'passport-jwt';
import {ExtractJwt} from 'passport-jwt';

import { PRIVATE_KEY } from '../../constants';

export const configureAuthStrategies = () => {
  passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: PRIVATE_KEY,
      algorithms: ['HS256']
    }, async (payload, done) => {
        try {
          done(null, payload);
        } catch (error) {
          done(error, null);
        }
    })
  );
};
