require('dotenv').config();
// 1. 首先引入express库：
import express, { Request, Response } from "express";
import * as bodyParser from 'body-parser';
import multer from 'multer';
const path = require('path')
const fs = require("fs");

// 2. 创建 express 的实例，代表服务器
const app = express();
app.use(express.static(path.join(__dirname, "../public"))); // 设置静态资源
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.all("*",function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With,content-type,Autherization");
	res.header("Access-Control-Allow-Methods","POST,GET");
	next();
});


// 3. 设置监听端口
const port = process.env.PORT;

// 文件上传作用
app.post("/api/fileUpload", multer({ dest: "./public/upload" }).any(), (req: any, res: Response) => {
  const { fieldname, originalname } = req.files[0];
  // 创建一个新路径
  const name = fieldname.slice(0, fieldname.indexOf("."));
  const newName = "public/upload/" + name + path.parse(originalname).ext;
  console.log(name, newName)
  fs.rename(req.files[0].path, newName, function (err: any) {
    if (err) {
      res.send({ code: 0, msg: "上传失败", data: [] });
    } else {
      res.send({ code: 1, msg: "上传成功", data: newName });
    }
  });
});

// 4. 调用 app.listen 来启动 server 并监听指定端口，启动成功后打印出 log
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);