const connection = require('../db/connection');

// 손님 정보 수정 페이지
exports.editConsumerInfo = (req, res) => {
  const Cid = req.query.Cid;
  const query = 'SELECT * FROM consumer WHERE Cid = ?';
  connection.query(query, [Cid], (err, results) => {
    if (err) {
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
    // 조회 결과가 있을 경우
    if (results.length > 0) {
      const consumer = results[0]; // 조회된 손님 정보를 가져옴
      res.send(`
        <h2>${consumer.Cname} 손님의 개인정보 수정</h2>
        <form action="/update-consumer?Cid=${Cid}" method="POST">
        <input type="hidden" id="Cid" name="Cid" value="${consumer.Cid}">
          <label for="Cname">이름:</label>
          <input type="text" id="Cname" name="Cname" value="${consumer.Cname}" required><br>

          <label for="Clocation">위치:</label>
          <input type="text" id="Clocation" name="Clocation" value="${consumer.Clocation}" required><br>

          <label for="Ccontact">연락처:</label>
          <input type="text" id="Ccontact" name="Ccontact" value="${consumer.Ccontact}" required><br>

          <label for="Cpw">PW:</label>
          <input type="text" id="Cpw" name="Cpw" value="${consumer.Cpw}" required><br>

          <button type="submit">수정하기</button>
        </form>
      `);
    } else {
      res.send('해당 손님의 정보를 찾을 수 없습니다.');
    }
  });
};

// 손님 정보 및 주문 내역 삭제 메서드
exports.deleteConsumerInfo = (req, res) => {
  const Cid = req.query.Cid;
  const deleteOrdersQuery = 'DELETE FROM orders WHERE Cid = ?';
  const deleteConsumerQuery = 'DELETE FROM consumer WHERE Cid = ?';
  // 손님 주문 내역 삭제
  connection.query(deleteOrdersQuery, [Cid], (err, results) => {
    if (err) {
      if (err.errno === 1451) {
        res.send('외래 키 제약 조건을 위반해 제거할 수 없습니다.');
      } else if (err.errno === 1146) {
        res.send('주문 정보를 저장하는 테이블이 존재하지 않습니다.');
      } else if (err.errno === 1045) {
        res.send('데이터베이스 접근 권한이 없습니다.');
      } else {
        console.error('손님 주문 내역 삭제 중 알 수 없는 오류 발생:', err);
        res.send('알 수 없는 오류로 인해 주문 내역 삭제에 실패했습니다.');
      }
      return;
    }
    // 손님 정보 삭제
    connection.query(deleteConsumerQuery, [Cid], (err, results) => {
      if (err) {
        if (err.errno === 1451) {
        res.send('외래 키 제약 조건을 위반해 제거할 수 없습니다.');
        } else if (err.errno === 1146) {
          res.send('손님 정보를 저장하는 테이블이 존재하지 않습니다.');
        } else if (err.errno === 1045) {
          res.send('데이터베이스 접근 권한이 없습니다.');
        } else {
          console.error('손님 정보 삭제 중 알 수 없는 오류 발생:', err);
          res.send('알 수 없는 오류로 인해 손님 정보 삭제에 실패했습니다.');
        }
        return;
      }
      if (results.affectedRows > 0) {
        res.send('손님의 개인 정보와 주문 내역이 성공적으로 삭제되었습니다.');
      } else {
        res.send('삭제할 데이터가 없습니다. 손님 ID를 확인해주세요.');
      }
    });
  });
};

// 사장님 정보 수정 페이지
exports.editOwnerInfo = (req, res) => {
  const Oid = req.query.Oid; // URL 쿼리에서 사장님 ID 가져오기
  const query = 'SELECT * FROM owner WHERE Oid = ?'; // 사장님 정보를 조회하는 SQL 쿼리

  connection.query(query, [Oid], (err, results) => {
    if (err) {
      // SQL 에러 번호 처리
      if (err.errno === 1045) {
        res.send('에러: 데이터베이스 접근 권한이 없습니다.');
      } else if (err.errno === 1146) {
        res.send('에러: 사장님 정보를 저장하는 테이블이 존재하지 않습니다.');
      } else if (err.errno === 1054) {
        res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다.');
      } else {
        console.error('사장님 정보 조회 중 알 수 없는 오류 발생:', err);
        res.send('알 수 없는 오류로 인해 사장님 정보를 조회할 수 없습니다.');
      }
      return;
    }

    // 조회 결과 처리
    if (results.length > 0) {
      const owner = results[0]; // 조회된 사장님 정보를 가져옴
      res.send(`
        <h2>${owner.Oname} 사장님 정보 수정</h2>
        <form action="/update-owner?Oid=${Oid}" method="POST">
        <input type="hidden" id="Oid" name="Oid" value="${owner.Oid}">
          <label for="Oname">이름:</label>
          <input type="text" id="Oname" name="Oname" value="${owner.Oname}" required><br>

          <label for="Olocation">위치:</label>
          <input type="text" id="Olocation" name="Olocation" value="${owner.Olocation}" required><br>

          <label for="Ocontact">연락처:</label>
          <input type="text" id="Ocontact" name="Ocontact" value="${owner.Ocontact}" required><br>

          <label for="Opw">PW:</label>
          <input type="text" id="Opw" name="Opw" value="${owner.Opw}" required><br>

          <button type="submit">수정하기</button>
        </form>
      `);
    } else {
      // 조회 결과가 없는 경우
      res.send('해당 사장님의 정보를 찾을 수 없습니다.');
    }
  });
};

// 손님 정보 업데이트 처리
exports.updateConsumerInfo = (req, res) => {
  const Cid = req.body.Cid;
  const { Cname, Clocation, Ccontact, Cpw } = req.body;

  // 입력값 검증
  if (!Cid) {
    res.send('에러: 손님 ID가 전달되지 않았습니다.');
    return;
  }
  if (Cname.length > 10) {
    res.send('에러: 이름은 최대 10자까지 입력할 수 있습니다.');
    return;
  }
  if (Clocation.length > 20) {
    res.send('에러: 위치는 최대 20자까지 입력할 수 있습니다.');
    return;
  }
  if (!/^\d{4}$/.test(Cpw)) {
    res.send('에러: 비밀번호는 4자리 숫자로 입력해야 합니다.');
    return;
  }

  const query = 'UPDATE consumer SET Cname = ?, Clocation = ?, Ccontact = ?, Cpw = ? WHERE Cid = ?';
  connection.query(query, [Cname, Clocation, Ccontact, Cpw, Cid], (err, results) => {
    if (err) {
      console.error('손님 정보 수정 중 오류 발생:', err);
      res.send('손님 정보 수정 중 오류가 발생했습니다.');
      return;
    }

    console.log('Affected Rows:', results.affectedRows);

    if (results.affectedRows > 0) {
      res.send(`${Cname} 손님의 정보가 성공적으로 수정되었습니다.`);
    } else {
      res.send('수정할 데이터가 없습니다. 손님 ID를 확인해주세요.');
    }
  });
};

// 사장님 정보 업데이트 처리
exports.updateOwnerInfo = (req, res) => {
  const Oid = req.body.Oid;
  const { Oname, Olocation, Ocontact, Opw } = req.body;
  // 입력값 검증
    if (Oname.length > 10) {
      res.send('에러: 이름은 최대 10자까지 입력할 수 있습니다.');
      return;
    }
    if (Olocation.length > 20) {
      res.send('에러: 위치는 최대 20자까지 입력할 수 있습니다.');
      return;
    }
    if (!/^\d{4}$/.test(Opw)) {
      res.send('에러: 비밀번호는 4자리 숫자로 입력해야 합니다.');
      return;
    }
      const query = 'UPDATE owner SET Oname = ?, Olocation = ?, Ocontact = ?, Opw = ? WHERE Oid = ?';

      connection.query(query, [Oname, Olocation, Ocontact, Opw, Oid], (err, results) => {
        if (err) {
          // SQL 에러 처리
          if (err.errno === 1045) {
            res.send('에러: 데이터베이스 접근 권한이 없습니다.');
          } else if (err.errno === 1146) {
            res.send('에러: 사장님 정보를 저장하는 테이블이 존재하지 않습니다.');
          } else if (err.errno === 1054) {
            res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다.');
          } else if (err.errno === 1062) {
            res.send('에러: 중복된 데이터가 존재합니다. 다시 확인해주세요.');
          } else {
            res.send('사장님 정보 수정에 실패했습니다.');
          }
          return;
        }

        // 업데이트 성공 처리
        if (results.affectedRows > 0) {
          res.send(`${Oname} 사장님의 정보가 성공적으로 수정되었습니다.`);
        } else {
          // 업데이트할 데이터가 없는 경우
          res.send('수정할 데이터가 없습니다. 사장님 ID를 확인해주세요.');
        }
      });
    };

// 메뉴 수정 페이지(사장님만 가능)
exports.editMenu = (req, res) => {
  const Mid = req.query.Mid;
  const query = 'SELECT * FROM menu WHERE Mid = ?';

  connection.query(query, [Mid], (err, results) => {
    if (err) {
      if (err.errno === 1045) {
        res.send('에러: 데이터베이스 접근 권한이 없습니다.');
      } else if (err.errno === 1146) {
        res.send('에러: 메뉴 정보를 저장하는 테이블이 존재하지 않습니다.');
      } else if (err.errno === 1054) {
        res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다.');
      } else {
        console.error('메뉴 조회 중 알 수 없는 오류 발생:', err);
        res.send('메뉴 조회에 실패했습니다.');
      }
      return;
    }

    if (results.length > 0) {
      const menu = results[0];
      res.send(`
        <h2>메뉴 수정: ${menu.Mname}</h2>
        <form action="/update-menu?Mid=${Mid}" method="POST">
          <label for="Mname">메뉴 이름:</label>
          <input type="text" id="Mname" name="Mname" value="${menu.Mname}" required><br>

          <label for="Mprice">메뉴 가격:</label>
          <input type="text" id="Mprice" name="Mprice" value="${menu.Mprice}" required><br>

          <button type="submit">수정하기</button>
        </form>
      `);
    } else {
      res.send('해당 메뉴를 찾을 수 없습니다.');
    }
  });
};

// 메뉴 수정 처리
exports.updateMenu = (req, res) => {
  const Mid = req.query.Mid;
  const { Mname, Mprice } = req.body;
  const query = 'UPDATE menu SET Mname = ?, Mprice = ? WHERE Mid = ?';

  connection.query(query, [Mname, Mprice, Mid], (err, results) => {
    if (err) {
      if (err.errno === 1045) {
        res.send('에러: 데이터베이스 접근 권한이 없습니다.');
      } else if (err.errno === 1146) {
        res.send('에러: 메뉴 정보를 저장하는 테이블이 존재하지 않습니다.');
      } else if (err.errno === 1054) {
        res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다.');
      } else {
        console.error('메뉴 수정 중 알 수 없는 오류 발생:', err);
        res.send('메뉴 수정에 실패했습니다.');
      }
      return;
    }

    if (results.affectedRows > 0) {
      res.send('메뉴가 성공적으로 수정되었습니다.');
    } else {
      res.send('수정할 데이터가 없습니다. 메뉴 ID를 확인해주세요.');
    }
  });
};

// 사장님 정보 삭제 처리 (메뉴와 주문 내역 유지)
exports.deleteOwnerInfo = (req, res) => {
  const Oid = req.query.Oid;
  const deleteMenuQuery = 'DELETE FROM menu WHERE Oid = ?';
  const deleteOwnerQuery = 'DELETE FROM owner WHERE Oid = ?';

  // 메뉴 삭제
  connection.query(deleteMenuQuery, [Oid], (err, results) => {
    if (err) {
      console.error('메뉴 삭제 중 오류 발생:', err);
      res.send('메뉴 삭제 중 오류가 발생했습니다.');
      return;
    }

    // 사장님 정보 삭제
    connection.query(deleteOwnerQuery, [Oid], (err, results) => {
      if (err) {
        console.error('사장님 정보 삭제 중 오류 발생:', err);
        res.send('사장님 정보 삭제 중 오류가 발생했습니다.');
        return;
      }

      if (results.affectedRows > 0) {
        res.send('사장님의 개인 정보와 관련 메뉴가 성공적으로 삭제되었습니다.');
      } else {
        res.send('삭제할 데이터가 없습니다. 사장님 ID를 확인해주세요.');
      }
    });
  });
};

// 메뉴 삭제 로직
// 메뉴 비활성화(삭제) 처리
exports.deleteMenu = (req, res) => {
  const Mid = req.query.Mid;
  const query = 'UPDATE menu SET is_active = false WHERE Mid = ?';

  connection.query(query, [Mid], (err, results) => {
    if (err) {
      if (err.errno === 1054) {
        res.send('에러: 데이터베이스 컬럼 정보가 잘못되었습니다.');
      } else {
        console.error('메뉴 비활성화 중 오류 발생:', err);
        res.send('메뉴 비활성화에 실패했습니다.');
      }
      return;
    }

    if (results.affectedRows > 0) {
      res.send('메뉴가 성공적으로 비활성화되었습니다.');
    } else {
      res.send('비활성화할 메뉴가 없습니다. 메뉴 ID를 확인해주세요.');
    }
  });
};
