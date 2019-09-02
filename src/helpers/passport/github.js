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
        const { id: githubId, displayName: name } = profile;
        console.info('profile info', profile);
        let user = await User.findOne({ githubId });
        if(!user) {
          const userData = {
            githubId,
            name,
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

