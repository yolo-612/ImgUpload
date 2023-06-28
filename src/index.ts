require('dotenv').config();
// 1. 首先引入express库：
import express, { Request, Response } from "express";
import * as bodyParser from 'body-parser';
import multer from 'multer';
import { FileUploaderServer } from "../utils/imgPart/index"
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


const upload = multer();

// 3. 设置监听端口
const port = process.env.PORT;

const fileUploader = new FileUploaderServer({
  tempFileLocation: path.join(__dirname, '../public/tempUploadFile'),
  mergedFileLocation: path.join(__dirname, '../public/mergedUploadFile'),
})

app.post('/api/initUpload', async (req: Request, res: Response) => {
  const { name } = req.body
  const uploadId = await fileUploader.initFilePartUpload(name)
  console.log(uploadId)
  res.json({ uploadId });
})


app.post('/api/uploadPart', upload.single('partFile'), async (req: any, res: Response) => {
  const { buffer } = req.file
  const { uploadId, partIndex } = req.body
  const partFileMd5 = await fileUploader.uploadPartFile(uploadId, partIndex, buffer)
  res.json({ partFileMd5 });
})

app.post('/api/finishUpload', async (req: Request, res: Response) => {
  const { uploadId, name, md5 } = req.body
  const { path: filePathOnServer } = await fileUploader.finishFilePartUpload(uploadId, name, md5)
  const suffix = filePathOnServer.split(`${path.sep}public${path.sep}`)[1]
  res.json({ path: suffix });
})

// 4. 调用 app.listen 来启动 server 并监听指定端口，启动成功后打印出 log
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);