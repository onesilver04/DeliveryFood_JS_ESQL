// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const viewRoutes = require('./routes/view');
const editInfoRoutes = require('./routes/editInfo');
const { createTables } = require('./controllers/createTables');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// 테이블 생성 실행
createTables();
// body-parser 설정
app.use(bodyParser.json());
// 기본 경로 - 메인 페이지 표시
app.get('/', (req, res) => {
  res.send(`
    <h2>Main page</h2>
    <button onclick="window.location.href='/register-consumer'">1. 손님 회원가입</button>
    <button onclick="window.location.href='/register-owner'">2. 사장님 회원가입</button>
    <button onclick="window.location.href='/login-consumer'">3. 손님 로그인</button>
    <button onclick="window.location.href='/login-owner'">4. 사장님 로그인</button>
  `);
});

// 사용자 인증 경로
app.use('/', authRoutes);
// 정보 조회 경로
app.use(viewRoutes);
// 개인 정보 수정 경로
app.use('/', editInfoRoutes);

// 서버 실행
app.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});