const express = require("express");
const router = express.Router();
const joi = require("joi");
const Response = require("../utils/Response");
const pool = require("../utils/db");

//通过放映厅ID查询放映厅
router.get("/cinema-room/query", (req, res) => {
  let { id } = req.query;
  let schema = joi.object({
    id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = `select
    mcr.room_name cinema_room_name,
    mcr.room_size cinema_room_size,
    mcr.movie_cinema_id cinema_id,
    mcr.room_type cinema_room_type,
    mc.cinema_name cinema_name
  from
    movie_cinema_room mcr join movie_cinema mc on mcr.movie_cinema_id=mc.id
  where
    mcr.id=?`;
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

//配置座位模板
router.post("/cinema-room/edit-seat-template", (req, res) => {
  let { id, seat_template, room_size } = req.body;
  let schema = joi.object({
    id: joi.string().required(),
    seat_template: joi.string().required(),
    room_size: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql =
    "update movie_cinema_room set seat_template=?,room_size=? where id=?";
  pool.query(sql, [seat_template, room_size, id], (error, result) => {
    if (error) {
      res.send(Response.error(400, error));
      throw error;
    }
    res.send(Response.ok(result));
  });
});

// 通过电影院ID查询所有放映厅
router.get("/cinema-rooms/movieid", (req, res) => {
  let { movie_cinema_id } = req.query;
  let schema = joi.object({
    movie_cinema_id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "select * from movie_cinema_room where movie_cinema_id=?";
  pool.query(sql, [movie_cinema_id], (error, result) => {
    if (error) {
      res.send(Response.error(400, error));
      throw error;
    }
    res.send(Response.ok(result));
  });
});

//删除放映厅
router.post("/cinema-room/del", (req, res) => {
  let { id } = req.body;
  let schema = joi.object({
    id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "delete from movie_cinema_room where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

//查询放映厅所有类型
router.get("/cinema-room/types", (req, res) => {
  let sql = "select * from movie_cinema_room_type";
  pool.query(sql, (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok(result));
  });
});

// 新增放映厅
router.post("/cinema-room/add", (req, res) => {
  let { room_name, room_type, movie_cinema_id } = req.body;
  let schema = joi.object({
    room_name: joi.string().required(),
    room_type: joi.string().required(),
    movie_cinema_id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql =
    "insert into movie_cinema_room (room_name, room_type, movie_cinema_id) values (?,?,?)";
  pool.query(sql, [room_name, room_type, movie_cinema_id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

module.exports = router;
