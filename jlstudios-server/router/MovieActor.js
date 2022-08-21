const express = require("express");
const router = express.Router();
const joi = require("joi");
const Response = require("../utils/Response");
const pool = require("../utils/db");

//通过电影ID查询演员
router.get("/movie-actors/movieid", (req, res) => {
  let { movie_id } = req.query;
  let schema = joi.object({
    movie_id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = `select ma.id actor_id,mima.movie_id movie_id,ma.actor_name actor_name,ma.actor_avatar actor_avatar from movie_actor ma join movie_info_map_actor mima on ma.id = mima.actor_id where mima.movie_id = ?`;
  pool.query(sql, [movie_id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok(result));
  });
});

// 删除演员
router.post("/movie-actor/del", (req, res) => {
  let { id } = req.body;
  let schema = joi.object({
    id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "delete from movie_actor where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

// 添加演员
router.post("/movie-actor/add", (req, res) => {
  let { actorName, actorAvatar } = req.body;
  let schema = joi.object({
    actorName: joi.string().required(),
    actorAvatar: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql = "insert into movie_actor (actor_name,actor_avatar) values (?,?)";
  pool.query(sql, [actorName, actorAvatar], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

// 模糊查询
router.post("/movie-actors/name", (req, res) => {
  let { name } = req.body;
  let schema = joi.object({
    name: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "select * from movie_actor where actor_name like ?";
  pool.query(sql, [`%${name}%`], (err, result) => {
    if (err) {
      throw err;
    }
    res.send(Response.ok(result));
  });
});

// 查询演员
router.get("/movie-actors", (req, res) => {
  let { page, pagesize } = req.query;
  let schema = joi.object({
    page: joi.number().required(),
    pagesize: joi.number().integer().required(),
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let startIndex = (page - 1) * 10;
  let size = parseInt(pagesize);
  let sql = "select * from movie_actor limit ?,?";
  pool.query(sql, [startIndex, size], (err, result) => {
    if (err) {
      throw err;
    }
    res.send(Response.ok(result));
  });
});

module.exports = router;
