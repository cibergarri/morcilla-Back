import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { User } from '../../models/user';
export const jwtConfig = {
  secret: 'secret',
  issuer: 'morcilla',
  audience: 'morcilla-conf-hackathon.herokuapp.com',
};

export const useJwtStrategy = () => {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = jwtConfig.secret;
  opts.issuer = jwtConfig.issuer;
  opts.audience = jwtConfig.audience;

  passport.use(new JwtStrategy(opts, async(jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.sub);
      if (user) {
        return done(null, user);
      } else {
          return done(null, false);
      }
    } catch(err) {
      console.error('error jwt',err);
    } 
  }));
};

