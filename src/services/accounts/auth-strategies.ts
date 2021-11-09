import config from 'config';
import passport from 'passport';
import {Strategy as JwtStrategy} from 'passport-jwt';
import {ExtractJwt} from 'passport-jwt';

export const configureAuthStrategies = () => {
  passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('tokenPrivateKey'),
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
