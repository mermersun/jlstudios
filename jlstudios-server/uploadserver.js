const express = require("express");
const app = express();
const port = 9000;
const Response = require("./utils/Response");

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const multer = require("multer");
const uuid = require("uuid");
const uploadTools = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "static");
    },
    filename: (req, file, callback) => {
      let name = file.originalname;
      let ext = name.substr(name.lastIndexOf("."));
      let newName = uuid.v4() + ext;
      callback(null, newName);
    },
  }),
});
//配置静态资源托管文件夹 直接通过http://localhost:9000+文件命 直接访问
app.use(express.static("static"));
app.post("/upload", uploadTools.single("file"), (req, res) => {
  let url = "http://localhost:9000/" + req.file.filename;
  res.send(Response.ok(url));
});

app.listen(port, () => {
  console.log("上传文件服务已启动...");
});
