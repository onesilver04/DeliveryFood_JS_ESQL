// 회원가입 폼&로직, 로그인 폼&로직&대시보드, 메뉴 추가 로직
const connection = require('../db/connection');

// 손님 회원가입 폼
exports.registerConsumer = (req, res) => {
  res.send(`
    <h2>손님 회원가입</h2>
    <form action="/submit-consumer" method="POST">
      <label for="Cid">ID:</label>
      <input type="text" id="Cid" name="Cid" required><br>

      <label for="Cname">이름:</label>
      <input type="text" id="Cname" name="Cname" required><br>

      <label for="Clocation">위치:</label>
      <input type="text" id="Clocation" name="Clocation" required><br>

      <label for="Ccontact">연락처:</label>
      <input type="text" id="Ccontact" name="Ccontact" required><br>

      <label for="Cpw">PW:</label>
      <input type="text" id="Cpw" name="Cpw" required><br>

      <button type="submit">저장하기</button>
    </form>
  `);
};
// 손님 회원가입 로직
exports.submitConsumer = (req, res) => {
  const { Cid, Cname, Clocation, Ccontact, Cpw } = req.body; // 요청에서 데이터 추출

  const query = 'INSERT INTO consumer (Cid, Cname, Clocation, Ccontact, Cpw) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [Cid, Cname, Clocation, Ccontact, Cpw], (err, results) => {
    if (err) {
      // SQL 오류 처리
      if (err.errno === 1062) {
        // 1062: Duplicate entry (중복 키 오류)
        res.send('에러: 이미 사용 중인 ID입니다. 다른 ID를 선택해주세요.');
      } else if (err.errno === 3819) {
        // 3819: Check constraint violated(CHECK 제약 조건 위반)
        res.send('에러: 입력된 데이터가 조건과 맞지 않습니다. 다시 시도해주세요.');
        res.send('*아이디와 비밀번호가 네 자릿수 정수인지 확인해주세요*');
      } else {
        console.error('손님 데이터 삽입 중 오류 발생:', err);
        res.send('손님 데이터 삽입에 실패했습니다.');
      }
      return;
    }
    res.send('손님 회원가입이 성공적으로 완료되었습니다!');
  });
};

// 사장님 회원가입 폼
exports.registerOwner = (req, res) => {
  res.send(`
    <h2>사장님 회원가입</h2>
    <form action="/submit-owner" method="POST">
      <label for="Oid">ID:</label>
      <input type="text" id="Oid" name="Oid" required><br>

      <label for="Oname">이름:</label>
      <input type="text" id="Oname" name="Oname" required><br>

      <label for="Olocation">위치:</label>
      <input type="text" id="Olocation" name="Olocation" required><br>

      <label for="Ocontact">연락처:</label>
      <input type="text" id="Ocontact" name="Ocontact" required><br>

      <label for="Opw">PW:</label>
      <input type="text" id="Opw" name="Opw" required><br>

      <button type="submit">저장하기</button>
    </form>
  `);
};
// 사장님 회원가입 로직
exports.submitOwner = (req, res) => {
  const { Oid, Oname, Olocation, Ocontact, Opw } = req.body; // 요청에서 데이터 추출

  const query = 'INSERT INTO owner (Oid, Oname, Olocation, Ocontact, Opw) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [Oid, Oname, Olocation, Ocontact, Opw], (err, results) => {
    if (err) {
          // SQL 오류 처리
          if (err.errno === 1062) {
            // 1062: Duplicate entry (중복 키 오류)
            res.send('에러: 이미 사용 중인 ID입니다. 다른 ID를 선택해주세요.');
          } else if (err.errno === 3819) {
            // 3819: Check constraint violated(CHECK 제약 조건 위반)
            res.send('에러: 입력된 데이터가 조건과 맞지 않습니다. 다시 시도해주세요.');
            res.send('*아이디와 비밀번호가 네 자릿수 정수인지 확인해주세요*');
          } else {
            console.error('사장님 데이터 삽입 중 오류 발생:', err);
            res.send('사장님 데이터 삽입에 실패했습니다.');
          }
          return;
        }
        res.send('사장님 회원가입이 성공적으로 완료되었습니다!');
  });
};

// 손님 로그인 페이지 렌더링
exports.showConsumerLoginForm = (req, res) => {
  res.send(`
    <h2>손님 로그인</h2>
    <form action="/login-consumer" method="POST">
      <label for="Cid">ID:</label>
      <input type="text" id="Cid" name="Cid" required><br>

      <label for="Cpw">PW:</label>
      <input type="text" id="Cpw" name="Cpw" required><br>

      <button type="submit">로그인</button>
    </form>
  `);
};
// 손님 로그인 로직
exports.loginConsumer = (req, res) => {
  const { Cid, Cpw } = req.body;
  const query = 'SELECT * FROM consumer WHERE Cid = ? AND Cpw = ?';
  connection.query(query, [Cid, Cpw], (err, results) => {
    if (err) { // SQL 관련 에러 처리
      if (err.errno === 1045) { // 1045: Access denied (권한 문제)
        res.send('에러: 데이터베이스 접근 권한이 없습니다. 관리자에게 문의하세요.');
      } else if (err.errno === 1146) { // 1146: Table does not exist (테이블 없음)
        res.send('에러: 로그인 테이블이 존재하지 않습니다. 관리자에게 문의하세요.');
      } else {
        console.error('손님 로그인 중 알 수 없는 오류 발생:', err);
        res.send('알 수 없는 오류로 인해 로그인에 실패했습니다.');
      }
      return;
    }
    // 로그인 성공 여부 확인
    if (results.length > 0) {
      res.redirect(`/consumer-dashboard?Cid=${Cid}`);
    } else {
      res.send('로그인 정보가 일치하지 않습니다.'); // 정보 불일치
    }
  });
};
// 대시보드 페이지 (로그인 후 새로운 버튼 페이지)
exports.consumerDashboard = (req, res) => {
  const Cid = req.query.Cid;
  res.send(`
    <h2>ID: ${Cid} 손님, 로그인에 성공하셨습니다! 환영합니다~!</h2>
    <button onclick="window.location.href='/view-consumer?Cid=${Cid}'">1. 정보 조회</button>
    <button onclick="window.location.href='/view-orders?Cid=${Cid}'">2. 주문 내역 조회</button>
    <button onclick="window.location.href='/delete-consumer?Cid=${Cid}'">3. 정보 삭제</button>
    <button onclick="window.location.href='/edit-consumer?Cid=${Cid}'">4. 정보 수정</button>
    <button onclick="window.location.href='/place-order?Cid=${Cid}'">5. 음식 주문하기</button>
    <button onclick="window.location.href='/'">6. 로그아웃</button>
  `);
};

// 사장님 로그인 페이지 렌더링
exports.showOwnerLoginForm = (req, res) => {
  res.send(`
    <h2>사장님 로그인</h2>
    <form action="/login-owner" method="POST">
      <label for="Oid">ID:</label>
      <input type="text" id="Oid" name="Oid" required><br>

      <label for="Opw">PW:</label>
      <input type="text" id="Opw" name="Opw" required><br>

      <button type="submit">로그인</button>
    </form>
  `);
};

// 사장님 로그인 로직
exports.loginOwner = (req, res) => {
  const { Oid, Opw } = req.body;
  const query = 'SELECT * FROM owner WHERE Oid = ? AND Opw = ?';

  connection.query(query, [Oid, Opw], (err, results) => {
    if (err) {
      // SQL 관련 에러 처리
      if (err.errno === 1045) {
        // 1045: Access denied (권한 문제)
        res.send('에러: 데이터베이스 접근 권한이 없습니다. 관리자에게 문의하세요.');
      } else if (err.errno === 1146) { // 1146: Table does not exist (테이블 없음)
        res.send('에러: 로그인 테이블이 존재하지 않습니다. 관리자에게 문의하세요.');
      } else if (err.errno === 1054) { // 1054: Unknown column (컬럼 오류)
        res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다. 관리자에게 문의하세요.');
      } else {
        console.error('사장님 로그인 중 알 수 없는 오류 발생:', err);
        res.send('알 수 없는 오류로 인해 로그인에 실패했습니다.');
      }
      return;
    }
    if (results.length > 0) {
      res.redirect(`/owner-dashboard?Oid=${Oid}`);
    } else {
      res.send('로그인 정보가 일치하지 않습니다.');
    }
  });
};
// 사장님 로그인 후 대시보드 페이지 (로그인 후 새로운 버튼 페이지)
exports.ownerDashboard = (req, res) => {
  const Oid = req.query.Oid;
  res.send(`
    <h2>ID: ${Oid} 사장님, 로그인에 성공하셨습니다! 환영합니다~!</h2>
    <button onclick="window.location.href='/view-owner?Oid=${Oid}'">1. 개인 정보 조회</button>
    <button onclick="window.location.href='/view-owner-menu?Oid=${Oid}'">2. 메뉴 조회</button>
    <button onclick="window.location.href='/delete-owner?Oid=${Oid}'">3. 개인 정보 삭제</button>
    <button onclick="window.location.href='/edit-owner?Oid=${Oid}'">4. 개인 정보 수정</button>
    <button onclick="window.location.href='/add-menu?Oid=${Oid}'">5. 메뉴 추가</button>
    <button onclick="window.location.href='/'">6. 로그아웃</button>
  `);
};

// 메뉴 추가 페이지
exports.showAddMenuForm = (req, res) => {
  const Oid = req.query.Oid;
  res.send(`
    <h2>메뉴 추가</h2>
    <form action="/add-menu?Oid=${Oid}" method="POST">
      <label for="Mname">메뉴 이름:</label>
      <input type="text" id="Mname" name="Mname" required><br>

      <label for="Mprice">가격:</label>
      <input type="text" id="Mprice" name="Mprice" required><br>

      <button type="submit">추가하기</button>
    </form>
  `);
};
// 메뉴 추가 로직
exports.addMenu = (req, res) => {
  const Oid = req.query.Oid; // 사장님의 ID
  const { Mname, Mprice } = req.body;
  const query = 'INSERT INTO menu (Mname, Mprice, Oid) VALUES (?, ?, ?)';

  connection.query(query, [Mname, Mprice, Oid], (err, results) => {
    if (err) {
      console.error('메뉴 추가 중 오류 발생:', err);
      res.send('메뉴 추가에 실패했습니다.');
      return;
    }
    res.send('메뉴가 성공적으로 추가되었습니다.');
  });
};