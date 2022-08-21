const express = require("express");
const router = express.Router();
const joi = require("joi");
const Response = require("../utils/Response");
const pool = require("../utils/db");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "JWT_SECRET_KEY";

router.post("/user/login", (req, res) => {
  let { username, userpwd } = req.body;
  let schema = joi.object({
    username: joi.string().required().pattern(new RegExp("^\\w{3,15}$")),
    userpwd: joi.string().required().pattern(new RegExp("^\\w{6,15}$")),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    res.send(Response.error(400, error));
    return;
  }
  let sql = "select * from admin where username=? and userpwd=MD5(?)";
  pool.query(sql, [username, userpwd], (error, result) => {
    if (error) {
      res.send(Response.error(500, error));
      throw error;
    }
    if (result.length == 0) {
      res.send(Response.error(1001, "账号密码错误"));
    } else {
      let user = result[0];
      let payload = { id: user.id, nickname: user.nickname };
      let token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
      user.userpwd = undefined;
      res.send(Response.ok({ user, token }));
    }
  });
});

module.exports = router;
