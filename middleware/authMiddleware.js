module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // 로그인한 경우 다음 미들웨어 실행
  }
  res.redirect("/login"); // 로그인되지 않았다면 로그인 페이지로 리디렉션
};
