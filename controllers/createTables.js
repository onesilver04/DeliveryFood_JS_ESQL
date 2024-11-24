const connection = require('../db/connection'); // 데이터베이스 연결

// 테이블 생성 함수
const createTables = () => {
  const tables = [
    {
      name: 'consumer',
      query: `
        CREATE TABLE IF NOT EXISTS consumer (
          Cid INT PRIMARY KEY CHECK (Cid BETWEEN 1000 AND 9999),
          Cname VARCHAR(10) NOT NULL,
          Clocation VARCHAR(20),
          Ccontact INT,
          Cpw INT NOT NULL CHECK (Cpw BETWEEN 1000 AND 9999)
        )
      `
    },
    {
      name: 'owner',
      query: `
        CREATE TABLE IF NOT EXISTS owner (
          Oid INT PRIMARY KEY CHECK (Oid BETWEEN 1000 AND 9999),
          Oname VARCHAR(10) NOT NULL,
          Olocation VARCHAR(20),
          Ocontact INT,
          Opw INT NOT NULL CHECK (Opw BETWEEN 1000 AND 9999)
        )
      `
    },
    {
      name: 'menu',
      query: `
        CREATE TABLE IF NOT EXISTS menu (
          Mid INT PRIMARY KEY AUTO_INCREMENT,
          Oid INT,
          Mname VARCHAR(50) NOT NULL,
          Mprice INT NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          FOREIGN KEY (Oid) REFERENCES owner(Oid) ON DELETE CASCADE
        )
      `
    },
    {
      name: 'orders',
      query: `
        CREATE TABLE IF NOT EXISTS orders (
          Rid INT PRIMARY KEY AUTO_INCREMENT,
          Cid INT,
          Mid INT,
          quantity INT NOT NULL,
          order_date DATE NOT NULL,
          FOREIGN KEY (Cid) REFERENCES consumer(Cid) ON DELETE CASCADE,
          FOREIGN KEY (Mid) REFERENCES menu(Mid) ON DELETE SET NULL
        )
      `
    }
  ];

  // 테이블 존재 확인
  tables.forEach(({ name, query }) => {
    connection.query(`SHOW TABLES LIKE '${name}'`, (err, results) => {
      if (err) {
        console.error(`${name} 테이블 확인 중 오류 발생:`, err);
        return;
      }
      if (results.length > 0) {
        console.log(`${name} 테이블이 이미 존재합니다.`);
      } else {
        connection.query(query, (err) => {
          if (err) {
            console.error(`${name} 테이블 생성 중 오류 발생:`, err);
          } else {
            console.log(`${name} 테이블이 성공적으로 생성되었습니다.`);
          }
        });
      }
    });
  });
};

// 모듈로 내보내기
module.exports = { createTables };
