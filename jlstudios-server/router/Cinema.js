const express = require("express");
const router = express.Router();
const joi = require("joi");
const Response = require("../utils/Response");
const pool = require("../utils/db");
// 修改电影院
router.post("/cinema/update", (req, res) => {
  let {
    id,
    cinema_name,
    address,
    province,
    city,
    district,
    longitude,
    latitude,
    tags,
  } = req.body;
  let schema = joi.object({
    id: joi.string().required(),
    cinema_name: joi.string().required(),
    address: joi.string().required(),
    province: joi.string().required(),
    city: joi.string().required(),
    district: joi.string().required(),
    longitude: joi.number().required(),
    latitude: joi.number().required(),
    tags: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql =
    "update movie_cinema set cinema_name=?,address=?,province=?,city=?,district=?,longitude=?,latitude=?,tags=? where id=?";
  pool.query(
    sql,
    [
      cinema_name,
      address,
      province,
      city,
      district,
      longitude,
      latitude,
      tags,
      id,
    ],
    (error, result) => {
      if (error) {
        res.send(Response.error(500, error));
        throw error;
      }
      res.send(Response.ok());
    }
  );
});

// 通过ID查询电影院
router.get("/cinema/query", (req, res) => {
  let { id } = req.query;
  let schema = joi.object({
    id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "select * from movie_cinema where id=?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(400, error));
      throw error;
    }
    if (result && result.length == 0) {
      res.send(Response.ok(null));
    } else {
      res.send(Response.ok(result[0]));
    }
  });
});

//删除电影院
router.post("/cinema/del", (req, res) => {
  let { id } = req.body;
  let schema = joi.object({
    id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "delete from movie_cinema where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

//查询所有电影院
router.get("/cinemas", (req, res) => {
  let sql = "select * from movie_cinema";
  pool.query(sql, (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok(result));
  });
});

//查询影院所有标签
router.get("/cinema/tags", (req, res) => {
  let sql = "select * from movie_cinema_tag";
  pool.query(sql, (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok(result));
  });
});

// 添加电影院
router.post("/cinema/add", (req, res) => {
  let {
    cinema_name,
    address,
    province,
    city,
    district,
    longitude,
    latitude,
    tags,
  } = req.body;
  let schema = joi.object({
    cinema_name: joi.string().required(),
    address: joi.string().required(),
    province: joi.string().required(),
    city: joi.string().required(),
    district: joi.string().required(),
    longitude: joi.number().required(),
    latitude: joi.number().required(),
    tags: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql =
    "insert into movie_cinema (cinema_name,address,province,city,district,longitude,latitude,tags) values (?,?,?,?,?,?,?,?)";
  pool.query(
    sql,
    [cinema_name, address, province, city, district, longitude, latitude, tags],
    (error, result) => {
      if (error) {
        res.send(Response.error(500, error));
        throw error;
      }
      res.send(Response.ok());
    }
  );
});

module.exports = router;
