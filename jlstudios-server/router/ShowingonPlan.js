const express = require("express");
const router = express.Router();
const joi = require("joi");
const Response = require("../utils/Response");
const pool = require("../utils/db");

//设置排片计划为发布状态
router.post("/plan/no-publish", (req, res) => {
  let { id } = req.body;
  let schema = joi.object({
    id: joi.number().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql = "update showingon_plan set status=0 where id=?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

//设置排片计划为发布状态
router.post("/plan/publish", (req, res) => {
  let { id } = req.body;
  let schema = joi.object({
    id: joi.number().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql = "update showingon_plan set status=1 where id=?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});

//删除排片计划
router.post("/plan/del", (req, res) => {
  let { id } = req.body;
  let schema = joi.object({
    id: joi.number().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql = "delete from showingon_plan where id=?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok());
  });
});
//添加排片计划
router.post("/plan/add", (req, res) => {
  let {
    cinema_id,
    cinema_room_id,
    movie_id,
    showingon_date,
    showingon_time,
    status,
    price,
  } = req.body;
  let schema = joi.object({
    cinema_id: joi.number().required(),
    cinema_room_id: joi.number().required(),
    movie_id: joi.number().required(),
    showingon_date: joi
      .string()
      .required()
      .pattern(new RegExp("\\d{4}-\\d{2}-\\d{2}")),
    showingon_time: joi
      .string()
      .required()
      .pattern(new RegExp("\\d{2}:\\d{2}")),
    status: joi.number().required(),
    price: joi.number().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql =
    "insert into showingon_plan (cinema_id,cinema_room_id,movie_id,showingon_date,showingon_time,status,price) values (?,?,?,?,?,?,?)";
  pool.query(
    sql,
    [
      cinema_id,
      cinema_room_id,
      movie_id,
      showingon_date,
      showingon_time,
      status,
      price,
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

//查询排片计划列表
router.get("/plans/roomid", (req, res) => {
  let { cinema_room_id } = req.query;
  let schema = joi.object({
    cinema_room_id: joi.number().required(),
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql = `SELECT
	sp.id plan_id,
	sp.cinema_id cinema_id,
	sp.cinema_room_id cinema_room_id,
	sp.movie_id movie_id,
	mi.title title,
	sp.showingon_date showingon_date,
	sp.showingon_time showingon_time,
	sp.status status,
	sp.price price
	
	FROM
		showingon_plan sp JOIN movie_info mi on sp.movie_id=mi.id
	WHERE
		cinema_room_id=? AND showingon_date>?
	ORDER BY
		showingon_date,showingon_time`;

  let now = new Date();
  let year = now.getFullYear();
  let month =
    now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth();
  let day = now.getDate() ? "0" + now.getDate() : now.getDate();
  let time = `${year}-${month}-${day}`;
  pool.query(sql, [cinema_room_id, time], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    res.send(Response.ok(result));
  });
});

module.exports = router;
