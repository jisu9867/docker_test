package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.redis.core.StringRedisTemplate; 

@RestController
public class UserController2 {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // —> GET / : 첫 페이지
    @GetMapping("/")
    public String hello() {
        return "Spring Boot START PAGE";
    }

    // → GET /mysql : SELECT NOW() 결과 출력
    @GetMapping("/mysql")
    public String dbTest() {
        try {
            String sql = "SELECT NOW()";
            java.sql.Timestamp now = jdbcTemplate.queryForObject(sql, java.sql.Timestamp.class);
            return "MySQL NOW(): " + now.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Database connection failed! Error: " + e.getMessage();
        }
    }

    @Autowired
    private StringRedisTemplate redis;

    @GetMapping("/redis-set")
    public String redisSet() {
        try {
            redis.opsForValue().set("key", "100");
            return "Redis SET OK. key=key, value=100";
        } catch (Exception e) {
            e.printStackTrace();
            return "Redis SET failed! Error: " + e.getMessage();
        }
    }

    @GetMapping("/redis-get")
    public String redisGet() {
        try {
            String value = redis.opsForValue().get("key");
            return "Redis GET OK. key=key >> " + value;
        } catch (Exception e) {
            e.printStackTrace();
            return "Redis GET failed! Error: " + e.getMessage();
        }
    }

}
