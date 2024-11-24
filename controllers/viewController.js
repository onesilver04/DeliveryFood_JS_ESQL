// 1. 정보조회 메뉴
// 손님로그인-2. 주문 내역 확인
// 사장님로그인-2. 메뉴 조회
const connection = require('../db/connection');

// 손님 정보 조회
exports.viewConsumerInfo = (req, res) => {
  const Cid = req.query.Cid; // 손님 ID
  const query = 'SELECT * FROM consumer WHERE Cid = ?';

  connection.query(query, [Cid], (err, results) => {
    if (err) {
      // SQL 에러 처리
      if (err.errno === 1045) {
        res.send('에러: 데이터베이스 접근 권한이 없습니다.');
      } else if (err.errno === 1146) {
        res.send('에러: 손님 정보를 저장하는 테이블이 존재하지 않습니다.');
      } else if (err.errno === 1054) {
        res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다.');
      } else {
        console.error('손님 정보 조회 중 알 수 없는 오류 발생:', err);
        res.send('알 수 없는 오류로 인해 손님 정보를 조회할 수 없습니다.');
      }
      return;
    }
    if (results.length > 0) {
      const consumer = results[0];
      res.send(`
        <h2>${consumer.Cname} 손님의 정보</h2>
        <p>ID: ${consumer.Cid}</p>
        <p>위치: ${consumer.Clocation}</p>
        <p>연락처: ${consumer.Ccontact}</p>
        <button onclick="window.location.href='/consumer-dashboard?Cid=${Cid}'">돌아가기</button>
      `);
    } else {
      res.send('해당 손님의 정보를 찾을 수 없습니다.');
    }
  });
};

// 손님 주문 내역 조회 메서드
exports.viewConsumerOrders = (req, res) => {
  const Cid = req.query.Cid;
  const query = `
    SELECT
      consumer.Cname AS 손님이름,
      consumer.Clocation AS 손님위치,
      menu.Mname AS 메뉴이름,
      menu.Mprice AS 가격,
      orders.quantity AS 주문수량,
      owner.Olocation AS 가게위치,
      orders.order_date AS 주문날짜,
      (menu.Mprice * orders.quantity) AS 총가격
    FROM consumer
    JOIN orders ON consumer.Cid = orders.Cid
    JOIN menu ON orders.Mid = menu.Mid
    JOIN owner ON menu.Oid = owner.Oid
    WHERE consumer.Cid = ?
  `;

  connection.query(query, [Cid], (err, results) => {
    if (err) {
      // SQL 오류 번호에 따른 에러 처리
      if (err.errno === 1045) {
        // 1045: Access denied (권한 문제)
        res.send('에러: 데이터베이스 접근 권한이 없습니다.');
      } else if (err.errno === 1146) {
        // 1146: Table does not exist (테이블 없음)
        res.send('에러: 주문 정보를 저장하는 테이블이 존재하지 않습니다.');
      } else if (err.errno === 1054) {
        // 1054: Unknown column (컬럼 오류)
        res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다.');
      } else {
        console.error('주문 내역 조회 중 알 수 없는 오류 발생:', err);
        res.send('알 수 없는 오류로 인해 주문 내역을 조회할 수 없습니다.');
      }
      return;
    }

    if (results.length > 0) {
      let orderList = `<h2>${results[0].손님이름} 손님의 주문 내역입니다:</h2>`;
      results.forEach(order => {
        orderList += `
          <p>
          <strong>손님 위치:</strong> ${order.손님위치}<br>
          <strong>메뉴 이름:</strong> ${order.메뉴이름}<br>
          <strong>개당 가격:</strong> ${order.가격}원<br>
          <strong>주문 수량:</strong> ${order.주문수량}<br>
          <strong>가게 위치:</strong> ${order.가게위치}<br>
          <strong>주문 날짜:</strong> ${order.주문날짜}<br>
          <strong>총 결제 금액:</strong> ${order.총가격}원<br>
          </p>
          <hr>
        `;
      });
      orderList += `<button onclick="window.location.href='/consumer-dashboard?Cid=${Cid}'">돌아가기</button>`;
      res.send(orderList);
    } else {
      res.send(`
        <h2>주문 내역이 없습니다.</h2>
        <button onclick="window.location.href='/consumer-dashboard?Cid=${Cid}'">돌아가기</button>
      `);
    }
  });
};

// 사장님 정보 조회
exports.viewOwnerInfo = (req, res) => {
  const Oid = req.query.Oid;
  const query = 'SELECT * FROM owner WHERE Oid = ?';

  connection.query(query, [Oid], (err, results) => {
    if (err) {
      console.error('사장님 정보 조회 중 오류 발생:', err);
      res.send('사장님 정보 조회에 실패했습니다.');
      return;
    }
    if (results.length > 0) {
      const owner = results[0];
      res.send(`
        <h2>${owner.Oname} 사장님의 개인 정보</h2>
        <p>ID: ${owner.Oid}</p>
        <p>위치: ${owner.Olocation}</p>
        <p>연락처: ${owner.Ocontact}</p>
        <button onclick="window.location.href='/owner-dashboard?Oid=${Oid}'">돌아가기</button>
      `);
    } else {
      res.send('해당 사장님의 정보를 찾을 수 없습니다.');
    }
  });
};

// 사장님 전용 메뉴 조회(활성화된 정보만 조회)
exports.viewOwnerMenu = (req, res) => {
  const Oid = req.query.Oid;
  const query = 'SELECT * FROM menu WHERE Oid = ? AND is_active = true';
  connection.query(query, [Oid], (err, results) => {
    if (err) {
      if (err.errno === 1045) {
        res.send('에러: 데이터베이스 접근 권한이 없습니다.');
      } else if (err.errno === 1146) {
        res.send('에러: 메뉴 정보를 저장하는 테이블이 존재하지 않습니다.');
      } else if (err.errno === 1054) {
        res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다.');
      } else {
        console.error('메뉴 조회 중 알 수 없는 오류 발생:', err);
        res.send('알 수 없는 오류로 인해 메뉴를 조회할 수 없습니다.');
      }
      return;
    }

    if (results.length > 0) {
      let menuList = `<h2>${Oid} 사장님의 가게에 등록된 메뉴 목록입니다:</h2>`;
      results.forEach((menu) => {
        menuList += `
          <p>메뉴 ID: ${menu.Mid}</p>
          <p>메뉴 이름: ${menu.Mname}</p>
          <p>메뉴 가격: ${menu.Mprice}원</p>
          <button onclick="window.location.href='/edit-menu?Mid=${menu.Mid}'">수정</button>
          <button onclick="window.location.href='/delete-menu?Mid=${menu.Mid}'">삭제</button>
          <button onclick="window.location.href='/owner-dashboard?Oid=${Oid}'">돌아가기</button>
          <hr>
        `;
      });
      res.send(menuList);
    } else {
      res.send('등록된 메뉴가 없습니다.');
    }
  });
};

// 메뉴판 전체 보기
exports.showPlaceOrderForm = (req, res) => {
  const Cid = req.query.Cid;
  const query = 'SELECT * FROM menu';
  connection.query(query, (err, results) => {
    if (err) {
      if (err.errno === 1045) {
        res.send('에러: 데이터베이스 접근 권한이 없습니다.');
      } else if (err.errno === 1146) {
        res.send('에러: 메뉴 정보를 저장하는 테이블이 존재하지 않습니다.');
      } else if (err.errno === 1054) {
        res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다.');
      } else {
        console.error('메뉴 조회 중 알 수 없는 오류 발생:', err);
        res.send('알 수 없는 오류로 인해 메뉴를 조회할 수 없습니다.');
      }
      return;
    }
    // 음식 주문 페이지
    let menuList = `<h2>음식 주문하기</h2><form action="/place-order?Cid=${Cid}" method="POST">`;
    results.forEach((menu) => {
      menuList += `
        <div>
          <label>
            <input type="checkbox" name="Mid" value="${menu.Mid}"> ${menu.Mname} - ${menu.Mprice}원
          </label>
          <input type="number" name="quantity_${menu.Mid}" placeholder="수량 입력" min="1"><br>
        </div>`;
    });
    menuList += '<button type="submit">주문하기</button></form>';
    res.send(menuList);
  });
};
// 메뉴 주문 로직
exports.placeOrder = (req, res) => {
  const Cid = req.query.Cid;
  const items = req.body.Mid;
  if (!items) {
    res.send('주문할 메뉴를 선택해주세요.');
    return;
  }
  const queries = [];
  if (Array.isArray(items)) {
    items.forEach((Mid) => {
      const quantity = req.body[`quantity_${Mid}`];
      if (quantity && quantity > 0) {
        queries.push([Cid, Mid, quantity, new Date()]);
      }
    });
  } else {
    const quantity = req.body[`quantity_${items}`];
    if (quantity && quantity > 0) {
      queries.push([Cid, items, quantity, new Date()]);
    }
  }
  if (queries.length === 0) {
    res.send('유효한 수량을 입력해주세요.');
    return;
  }
  const query = 'INSERT INTO orders (Cid, Mid, quantity, order_date) VALUES ?';
  connection.query(query, [queries], (err) => {
    if (err) {
      if (err.errno === 1452) {
        res.send('에러: 존재하지 않는 메뉴 ID를 선택했습니다. 다시 시도해주세요.');
      } else if (err.errno === 1048) {
        res.send('에러: 필수 입력값이 누락되었습니다. 다시 확인해주세요.');
      } else {
        console.error('주문 저장 중 알 수 없는 오류 발생:', err);
        res.send('알 수 없는 오류로 인해 주문 저장에 실패했습니다.');
      }
      return;
    }
    res.send('주문이 성공적으로 저장되었습니다.');
  });
};
