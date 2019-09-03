import { User } from '../models/user';

module.exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if(!user) throw new Error('user not found');
  return user;
}