const express = require('express');
const multer = require('multer');
const path = require('path');
const { isAuthenticated } = require("../middleware/authMiddleware");
const Post = require('../models/Post');

const router = express.Router();

// 🛑 보호된 페이지 (로그인한 사용자만 접근 가능)
router.get("/explore", isAuthenticated, (req, res) => {
    res.render("explore", { user: req.user });
  });

// Multer 설정: 이미지 저장 폴더 및 파일명 지정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/"); // 이미지 저장 폴더
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
    },
  });
  const upload = multer({ storage });

// 🛑 게시글 업로드 (로그인한 사용자만 가능)
router.post("/", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      const { title, content } = req.body;
  
      const newPost = new Post({
        title,
        content,
        images: req.file ? ["/uploads/" + req.file.filename] : [],
        author: {
          _id: req.user._id, // 현재 로그인한 사용자 ID 저장
          username: req.user.username,
         }, // 로그인한 사용자 정보 저장
        createdAt: new Date(),
      });
  
      await newPost.save();
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating post");
    }
  });

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    // ✅ 날짜 변환 후 `formattedDate` 필드 추가
    const formattedPosts = posts.map(post => ({
      ...post._doc,
      formattedDate: new Date(post.createdAt).toISOString().split("T")[0] // YYYY-MM-DD 형식
    }));

    res.render("index", { posts: formattedPosts });
  } catch (error) {
    console.error("게시글 불러오기 오류:", error);
    res.status(500).send("서버 오류");
  }
});

// 📌 특정 게시글 가져오기 (/:id)
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author");
    if (!post) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }
    res.render("post", { post });
  } catch (error) {
    console.error("게시글 불러오기 오류:", error);
    res.status(500).send("서버 오류 발생");
  }
});

// 게시물 삭제 라우트
router.post("/post/:id/delete", isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("게시물을 찾을 수 없습니다.");
    }
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류");
  }
});

module.exports = router;
