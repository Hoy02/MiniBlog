const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User'); // User 모델 불러오기

const router = express.Router();

// 회원가입 페이지 렌더링
router.get('/register', (req, res) => {
    res.render('register');
  });

// 회원가입 처리
router.post('/register', async (req, res) => {
  try {
    // 클라이언트가 보낸 데이터 받기
    const { username, email, password } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 유저 생성
    const newUser = new User({ username, email, password: hashedPassword });

    // MongoDB에 저장
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('register', { error: 'Something went wrong. Please try again.' });
  }
});

// 로그인 페이지 렌더링
router.get('/login', (req, res) => {
    res.render('login');
  });

// 로그인 처리
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

// 로그아웃 처리
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    res.redirect('/login');
  });
});

module.exports = router;
