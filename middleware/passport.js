import pkg from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const { Strategy, ExtractJwt } = pkg;
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const funPassport = (passport) => {
  passport.use(
    new Strategy(options, async (payload, done) => {
      try {
        const user = await User.findOne({ where: { userID: payload.userID } });

        if (user) {
          done(null, { userID: user.userID, email: user.email });
        } else {
          done(null, false);
        }
      } catch (e) {
        console.log(e);
      }
    })
  );
};
export default funPassport;
