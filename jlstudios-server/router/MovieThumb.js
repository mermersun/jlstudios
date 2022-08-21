const express = require("express");
const router = express.Router();
const joi = require("joi");
const Response = require("../utils/Response");
const pool = require("../utils/db");

// 通过ID查找剧照
router.post("/movie-thumbs/movieid", (req, res) => {
  let { movie_id } = req.body;
  let schema = joi.object({
    movie_id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "select * from movie_thumb where movie_id=?";
  pool.query(sql, [movie_id], (error, result) => {
    if (error) {
      res.send(Response.error(400, error));
      throw error;
    }
    res.send(Response.ok(result));
  });
});

// 删除剧照
router.post("/movie-thumb/del", (req, res) => {
  let { id } = req.body;
  let schema = joi.object({
    id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "delete from movie_thumb where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

// 添加剧照
router.post("/movie-thumb/add", (req, res) => {
  let { url, movie_id } = req.body;
  let schema = joi.object({
    url: joi.string().required(),
    movie_id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql = "insert into movie_thumb (url,movie_id) values (?,?)";
  pool.query(sql, [url, movie_id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});
module.exports = router;
