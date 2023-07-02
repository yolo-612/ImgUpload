require('dotenv').config();
// 1. 首先引入express库：
import express, { Request, Response } from "express";
import * as bodyParser from 'body-parser';
import multer from 'multer';
const path = require('path')

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

const storage = multer.diskStorage({
  // 上传文件的目录
  destination: function (req, file, cb) {
    cb(null, 'public/upload')
  },
  // 上传文件的名称
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
// multer 配置
const upload = multer({
  storage
})


// 3. 设置监听端口
const port = process.env.PORT;

// 文件上传作用
app.post("/api/fileUpload", upload.any(), (req: any, res: Response) => {  
  const { originalname } = req.files[0];
  // 创建一个新路径
  const name = originalname.slice(0, originalname.indexOf("."));
  const newName = "public/upload/" + name + path.parse(originalname).ext;
  console.log(name, newName)
  res.send({ code: 1, msg: "上传成功", data: `http://localhost:${port}/${newName}` });
});

app.get('/api/fileDownload', (req, res) => {
  const file = path.join(__dirname, "../public/upload/a.txt")
  res.download(file, 'a--kk.txt');
});

// 4. 调用 app.listen 来启动 server 并监听指定端口，启动成功后打印出 log
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);