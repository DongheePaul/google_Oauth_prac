// main.js
const express = require("express");
const axios = require("axios");
const conf = require("./config.json");

const app = express();

const GOOGLE_CLIENT_ID = conf.gg.client_id;
const GOOGLE_CLIENT_SECRET = conf.gg.secret;
const GOOGLE_LOGIN_REDIRECT_URI = "http://localhost:3000/login/redirect";
const GOOGLE_SIGNUP_REDIRECT_URI = "http://localhost:3000/signup/redirect";
// 토큰을 요청하기 위한 구글 인증 서버 url
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
// email, google id 등을 가져오기 위한 url
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

// 로그인 버튼을 누르면 GET /login으로 이동
app.get("/", (req, res) => {
  res.send(`
        <h1>Log in</h1>
        <a href="/login">Log in</a>
        <a href="/signup">Sign up</a>
    `);
});

// 모든 로직을 처리한 뒤 구글 인증 서버인 https://accounts.google.com/o/oauth2/v2/auth으로 redirect
app.get("/login", (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`;
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

// 회원가입 라우터
app.get("/signup", (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_SIGNUP_REDIRECT_URI}`;
  url += "&response_type=code";
  url += "&scope=email profile";
  res.redirect(url);
});

app.get("/signup/redirect", async (req, res) => {
  const { code } = req.query;
  console.log(`code: ${code}`);

  // access_token, refresh_token 등의 구글 토큰 정보 가져오기
  const resp = await axios.post(GOOGLE_TOKEN_URL, {
    // x-www-form-urlencoded(body)
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
    grant_type: "authorization_code",
  });
  // email, google id 등의 사용자 구글 계정 정보 가져오기
  const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
    // Request Header에 Authorization 추가
    headers: {
      Authorization: `Bearer ${resp.data.access_token}`,
    },
  });

  res.json(resp2.data);
});

app.listen(3000, () => {
  console.log("server is running at 3000");
});
