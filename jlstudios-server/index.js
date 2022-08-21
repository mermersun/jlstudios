const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "JWT_SECRET_KEY";
const Response = require("./utils/Response");
const port = 3000; // 服务端口

// 配置跨域
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

// 解析post请求参数
app.use(express.urlencoded());

const tokenTools = function (req, res, next) {
  if (req.path == "/user/login") {
    next();
    return;
  }
  let token = req.headers["authorization"];
  try {
    let payload = jwt.verify(token, SECRET_KEY);
    req.tokenPayload = payload;
  } catch (error) {
    res.send(Response.error(401, "用户验证失败，请重新登录"));
    return;
  }
  next();
};
app.use(tokenTools);

/** 接口， 处理/请求 */
app.listen(port, () => {
  console.log("嘉禄影城后端服务已启动...");
});

app.use(require("./router/MovieActor"));
app.use(require("./router/MovieDirector"));
app.use(require("./router/MovieInfo"));
app.use(require("./router/MovieThumb"));
app.use(require("./router/Cinema"));
app.use(require("./router/CinemaRoom"));
app.use(require("./router/ShowingonPlan"));
app.use(require("./router/Admin"));
