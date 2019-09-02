import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2'
import { User } from '../../models/user';
import { logger } from '../winston/log';

export const useGitHubStrategy = () => {
  passport.use(
    new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.ENV_URL}/home`,
    },  async function(accessToken, refreshToken, profile, cb) {
      try {
        const {
          id: githubId,
          displayName = '',
          username,
          photos = [],
          _json: { email },
        } = profile;
        logger.info('profile info from github %o', profile);
        let user = await User.findOne({ githubId });
        if(!user) {
          const userData = {
            githubId,
            name: displayName || username,
            photo: photos[0] ? (photos[0].value || '') : '',
            email
          };
          logger.info('creating user');
          user = new User(userData);      
          user = await user.save();
        }
        cb(undefined, user);
      } catch(error) {
        cb(error);
      }
    })
  );
};

