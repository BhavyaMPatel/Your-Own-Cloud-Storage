const express = require("express");

const mongoose = require("mongoose");

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require('dotenv').config()
const app = express();
app.use(express.json());

//to parse body from url
app.use(express.urlencoded({
  extended: false
}));

app.use(express.static("public"));
app.set('view engine', 'ejs');
mongoose.set('strictQuery', false);

const mongoURI=`mongodb+srv://{UserName}:{Password}@bhavya.k6nfals.mongodb.net/`

try {
  mongoose.connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
} catch (error) {
  handleError(error);
}
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

//creating bucket
let bucket;
let db
mongoose.connection.on("connected", () => {
  db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "newBucket"
});

//storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "newBucket"
      };
      resolve(fileInfo);
    });
  }
});
//
const upload = multer({
  storage
});


//Routes
app.get('/', async (req, res) => {
    let f=[];
    await bucket.find({}).toArray((err,files)=>{
    f=files;
    return res.render("Home",{f,f});
  });

});

app.get("/fileinfo/:filename", async(req, res) => {
    const file = bucket
      .find({
        filename: req.params.filename
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404)
            .json({
              err: "no files exist"
            });
        }
        bucket.openDownloadStreamByName(req.params.filename).pipe(res);
      });
});

app.post("/upload", upload.any(), (req, res) => {
    res.status(200).redirect("/upload/success");
});

app.post('/delete',async function(req,res){
  await bucket.find({filename:req.body.name}).toArray((err,files)=>{
    bucket.delete(files[0]._id);
  });
  res.status(201).json({user:"ok"})
})

app.get('/upload/success',(req,res)=>{
  res.send("Upload successful");
})

const PORT = process.env.PORT | 1000;

app.listen(PORT, () => {
    console.log(`Application live on localhost:{process.env.PORT}`);
});

});
