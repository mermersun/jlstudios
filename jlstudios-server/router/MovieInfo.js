const express = require("express");
const router = express.Router();
const joi = require("joi");
const Response = require("../utils/Response");
const pool = require("../utils/db");

// 通过ID查询电影
router.get("/movie-info/query", (req, res) => {
  let { id } = req.query;
  let schema = joi.object({
    id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "select * from movie_info where id=?";
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

// 删除电影
router.post("/movie-info/del", (req, res) => {
  let { id } = req.body;
  let schema = joi.object({
    id: joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  let sql = "delete from movie_info where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

// 查询所有电影
router.get("/movie-infos", async (req, res) => {
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
  try {
    // 查询数组
    let startIndex = (page - 1) * pagesize;
    let size = parseInt(pagesize);
    let sql = "select * from movie_info limit ?,?";
    let result = await pool.querySync(sql, [startIndex, size]);
    // 查询总条目
    let sql2 = "select count(*) as count from movie_info";
    let result2 = await pool.querySync(sql2, [startIndex, size]);
    let total = result2[0].count;

    res.send(
      Response.ok({ page: parseInt(page), pagesize: size, total, result })
    );
  } catch (error) {
    res.send(Response.error(error));
  }
});

// 通过电影名称关键字模糊查询所有电影
router.post("/movie-infos/name", async (req, res) => {
  let { name, page, pagesize } = req.body;
  let schema = joi.object({
    name: joi.string().required(),
    page: joi.number().required(),
    pagesize: joi.number().integer().max(100).required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    throw error;
  }
  try {
    // 查询数组
    let startIndex = (page - 1) * pagesize;
    let size = parseInt(pagesize);
    let sql = "select * from movie_info where title like ? limit ?,?";
    let result = await pool.querySync(sql, [`%${name}%`, startIndex, size]);
    // 查询总条目
    let sql2 = "select count(*) as count from movie_info where title like ?";
    let result2 = await pool.querySync(sql2, [`%${name}%`]);
    let total = result2[0].count;

    res.send(
      Response.ok({ page: parseInt(page), pagesize: size, total, result })
    );
  } catch (error) {
    res.send(Response.error(error));
  }
});

// 查询所有电影类型
router.get("/movie-types", (req, res) => {
  let sql = "select * from movie_type";
  pool.query(sql, (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok(result));
  });
});

// 添加电影
router.post("/movie-info/add", (req, res) => {
  let {
    categoryId,
    cover,
    title,
    type,
    starActor,
    showingon,
    score,
    description,
    duration,
  } = req.body;
  let schema = joi.object({
    categoryId: joi.required(),
    cover: joi.string().required(),
    title: joi.string().required(),
    type: joi.string().required(),
    starActor: joi.string().required(),
    showingon: joi.string().required(),
    score: joi.string().required(),
    description: joi.string().required(),
    duration: joi.required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql =
    "insert into movie_info (category_id,cover,title,type,star_actor,showingon,score,description,duration) values (?,?,?,?,?,?,?,?,?)";
  pool.query(
    sql,
    [
      categoryId,
      cover,
      title,
      type,
      starActor,
      showingon,
      score,
      description,
      duration,
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

// 修改电影
router.post("/movie-info/update", (req, res) => {
  let {
    id,
    category_id,
    cover,
    title,
    type,
    star_actor,
    showingon,
    score,
    description,
    duration,
  } = req.body;
  let schema = joi.object({
    id: joi.number().required(),
    category_id: joi.number().required(),
    cover: joi.string().required(),
    title: joi.string().required(),
    type: joi.string().required(),
    star_actor: joi.string().required(),
    showingon: joi.string().required(),
    score: joi.string().required(),
    description: joi.string().required(),
    duration: joi.number().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql =
    "update movie_info set category_id=?,cover=?,title=?,type=?,star_actor=?,showingon=?,score=?,description=?,duration=? where id=?";
  pool.query(
    sql,
    [
      category_id,
      cover,
      title,
      type,
      star_actor,
      showingon,
      score,
      description,
      duration,
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

//绑定电影的演员
router.post("/movie-info/bind-actors", async (req, res) => {
  let { movie_id, actor_ids } = req.body;
  let schema = joi.object({
    movie_id: joi.string().required(),
    actor_ids: joi.allow(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  try {
    let sql1 = "delete from movie_info_map_actor where movie_id=?";
    await pool.querySync(sql1, [movie_id]);

    if (!actor_ids) {
      res.send(Response.ok());
      return;
    }
    let params = "";
    let paramsArray = [];
    let ids = actor_ids.split(",");
    for (let i = 0; i < ids.length; i++) {
      params += "(?,?),";
      paramsArray.push(movie_id);
      paramsArray.push(ids[i]);
    }
    let sql2 =
      "insert into movie_info_map_actor (movie_id,actor_id) values " + params;
    sql2 = sql2.substring(0, sql2.length - 1);
    await pool.querySync(sql2, paramsArray);
    res.send(Response.ok());
  } catch (error) {
    res.send(Response.error(500, error));
  }
});

module.exports = router;
