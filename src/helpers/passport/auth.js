import passport from 'passport';
import { useGitHubStrategy } from './github';
import { useJwtStrategy } from './jwt';

export const initializePassport = (app) => {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  useGitHubStrategy();
  useJwtStrategy();
  app.use(passport.initialize());
  app.use(passport.session());
}
