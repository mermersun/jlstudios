const express = require("express");
const router = express.Router();
const joi = require("joi");
const Response = require("../utils/Response");
const pool = require("../utils/db");

// 删除导演
router.post("/movie-director/del", (req, res) => {
  let { id } = req.body;
  let schema = joi.object({
    id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "delete from movie_director where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

// 添加导演
router.post("/movie-director/add", (req, res) => {
  let { directorName, directorAvatar } = req.body;
  let schema = joi.object({
    directorName: joi.string().required(),
    directorAvatar: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql =
    "insert into movie_director (director_name,director_avatar) values (?,?)";
  pool.query(sql, [directorName, directorAvatar], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

// 模糊查询
router.post("/movie-directors/name", (req, res) => {
  let { name } = req.body;
  let schema = joi.object({
    name: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "select * from movie_director where director_name like ?";
  pool.query(sql, [`%${name}%`], (err, result) => {
    if (err) {
      throw err;
    }
    res.send(Response.ok(result));
  });
});

// 查询导演
router.get("/movie-directors", (req, res) => {
  let { page, pagesize } = req.query;
  let schema = joi.object({
    page: joi.number().required(),
    pagesize: joi.number().integer().max(100).required(),
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let startIndex = (page - 1) * 10;
  let size = parseInt(pagesize);
  let sql = "select * from movie_director limit ?,?";
  pool.query(sql, [startIndex, size], (err, result) => {
    if (err) {
      throw err;
    }
    res.send(Response.ok(result));
  });
});

module.exports = router;
