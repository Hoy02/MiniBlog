const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User.js'); // User 모델 가져오기

// Local Strategy 설정
passport.use(
  new LocalStrategy(
    { usernameField: 'email' }, // email을 username 대신 사용
    async (email, password, done) => {
      try {
        // 사용자 조회
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'No user found with this email.' });
        }

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// 사용자 객체를 세션에 저장
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 세션에서 사용자 정보 복구
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
