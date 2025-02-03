const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require("connect-flash");
const passport = require('passport'); // Passport 설정 가져오기
require("./config/passport");
const authRoutes = require('./routes/auth'); // 로그인/회원가입 라우트
const postRoutes = require('./routes/posts');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/User.js'); // User 모델
const app = express();
const PORT = 3000;

const router = express.Router();

// MongoDB 연결
mongoose.connect('mongodb://127.0.0.1:27017/travel-blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// 미들웨어 설정
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: 'your_secret_key', // 보안 키
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Flash 메시지 사용
app.use(flash());

// 로그인한 사용자 정보를 모든 EJS 템플릿에서 사용 가능하게 설정
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// 라우트 등록
app.use('/', authRoutes);
app.use('/auth', authRoutes);
app.use('/', postRoutes);
app.use('/post', postRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { posts });
});
