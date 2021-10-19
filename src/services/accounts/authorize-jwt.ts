import {Strategy as JwtStrategy} from 'passport-jwt';
import {ExtractJwt} from 'passport-jwt';
import { PRIVATE_KEY } from '../../constants';
import { selectPlayerByUsername } from '../../repository/player';

const  opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PRIVATE_KEY,
  algorithms: ['HS256']
};

export default (passport) => {
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {

    const player = await selectPlayerByUsername(jwt_payload.sub);

    if (!player) return done(new Error('No player found with username'), false);
    
    return done(null, player);
  }));
};
