const express = require('express');
const mysql = require('mysql2/promise');
const { createClient } = require('redis');

const {
  PORT = 3000,                       // port설정
  DB_HOST = 'db',                     // mysql 서비스 설정
  DB_PORT = '3306',                   // mysql port 설정
  DB_USER = 'root',
  DB_PASSWORD = '1212',               // mysql root 비밀번호
  DB_NAME = 'demo_db',                // mysql db명 설정
  REDIS_URL = 'redis://redis:6379/0', // redis서비스 url (port 6379)
} = process.env;

const app = express();

let pool;
let redisClient;

async function init() {
  // MySQL 커넥션 풀
  pool = await mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Redis 클라이언트
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on('error', (err) => console.error('Redis error:', err));
  await redisClient.connect();

  // 루트
  app.get('/', (req, res) => {
    res.send('Node App START PAGE');
  });

  // 헬스체크
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // MySQL NOW()
  app.get('/mysql', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT NOW() AS now');
      res.send(`MySQL OK. NOW() = ${rows[0].now}`);
    } catch (e) {
      console.error(e);
      res.status(500).send(`MySQL connection failed: ${e.message}`);
    }
  });

  // 예시: users 테이블 조회
  app.get('/users', async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, created_at FROM users ORDER BY id'
      );
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).send(`Users query failed: ${e.message}`);
    }
  });

  // Redis SET
  app.get('/redis-set', async (req, res) => {
    try {
      const key = req.query.key || 'color';
      const value = req.query.value || 'blue';
      await redisClient.set(key, value);
      res.send(`Redis SET OK. ${key}=${value}`);
    } catch (e) {
      console.error(e);
      res.status(500).send(`Redis SET failed: ${e.message}`);
    }
  });

  // Redis GET
  app.get('/redis-get', async (req, res) => {
    try {
      const key = req.query.key || 'color';
      const value = await redisClient.get(key);
      res.send(`Redis GET OK. ${key}=${value}`);
    } catch (e) {
      console.error(e);
      res.status(500).send(`Redis GET failed: ${e.message}`);
    }
  });

  // Redis INCR
  app.get('/redis-incr', async (req, res) => {
    try {
      const key = req.query.key || 'visits';
      const val = await redisClient.incr(key);
      res.send(`Redis INCR OK. ${key}=${val}`);
    } catch (e) {
      console.error(e);
      res.status(500).send(`Redis INCR failed: ${e.message}`);
    }
  });

  app.listen(Number(PORT), () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

init().catch((e) => {
  console.error('Fatal init error:', e);
  process.exit(1);
});
