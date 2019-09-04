import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../../models/user';
import { logger } from '../winston/log';
export const jwtConfig = {
  secret: 'secret',
  issuer: 'morcilla',
  audience: 'morcilla-conf-hackathon.herokuapp.com',
};

export const useJwtStrategy = () => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = jwtConfig.secret;
  opts.issuer = jwtConfig.issuer;
  opts.audience = jwtConfig.audience;

  passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.sub);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      logger.error('error jwt %o', err);
    }
  }));
};
