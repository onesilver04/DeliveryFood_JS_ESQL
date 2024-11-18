const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Eunjung123',
  database: 'deliveryfood'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL에 성공적으로 연결되었습니다!');
});

module.exports = connection;
