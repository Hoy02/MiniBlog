const express = require('express');
const mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
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
const PORT = process.env.PORT || 3000;

const router = express.Router();

dotenv.config(); // .env 파일 로드

const MONGO_URI = "mongodb+srv://khoyoung02:ghdudrla02@travel-blog.l14b6.mongodb.net/?retryWrites=true&w=majority&appName=travel-blog";
;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB 연결 성공!"))
.catch(err => console.log("MongoDB 연결 실패: ", err));

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

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 설정
app.use(express.static(path.join(__dirname, 'public')));

// 메인 페이지 라우트
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render('index', { posts });
  } catch (err) {
    console.error("게시글 불러오기 오류:", err);
    res.render('index', { posts: [] });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server is running on ${PORT}`);
});
