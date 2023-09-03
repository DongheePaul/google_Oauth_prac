// main.js
const express = require("express");
const axios = require("axios");
const conf = require("./config.json");

const app = express();

const GOOGLE_CLIENT_ID = conf.gg.client_id;
const GOOGLE_CLIENT_SECRET = conf.gg.secret;
const GOOGLE_REDIRECT_URI = "http://localhost:3000/login/redirect";

// 로그인 버튼을 누르면 GET /login으로 이동
app.get("/", (req, res) => {
  res.send(`
        <h1>Log in</h1>
        <a href="/login">Log in</a>
    `);
});

// 모든 로직을 처리한 뒤 구글 인증 서버인 https://accounts.google.com/o/oauth2/v2/auth으로 redirect
app.get("/login", (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
  // 필수 옵션.
  url += "&response_type=code";
  // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
  url += "&scope=email profile";
  // 완성된 url로 이동. 구글 계정을 선택하는 화면이 나옴
  res.redirect(url);
});

// 구글 계정 선택 화면에서 계정 선택 후 redirect 된 주소
app.get("/login/redirect", (req, res) => {
  const { code } = req.query;
  console.log(`code: ${code}`);
  res.send("ok");
});

app.listen(3000, () => {
  console.log("server is running at 3000");
});
