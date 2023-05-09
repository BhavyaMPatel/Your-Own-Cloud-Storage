const express = require("express");
var MongoClient = require('mongodb').MongoClient
var ObjectId=require("mongodb").ObjectId;
const  Grid  = require("gridfs-stream");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
const fs = require('fs');
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

const mongoURI=`mongodb+srv://BhavyaMPatel:PatelBhavyaM@bhavya.k6nfals.mongodb.net/`

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






app.get('/', async (req, res) => {
    let f=[];
    await bucket.find({}).toArray((err,files)=>{
   
    f=files;
    return res.render("Home",{f,f});
  });
  // console.log('hi');
  // console.log(file);


});

app.get("/fileinfo/:filename", async(req, res) => {
    // console.log('ye');
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
            // alert("Error In Database")
        }
        bucket.openDownloadStreamByName(req.params.filename).pipe(res);
        
      });
      const uploaded_files = await bucket.find({filename:req.params.filename}).toArray((err,files)=>{
        // return res.render("Home",{files,files});
        console.log(files);
        // console.log(files);
      });

      
});

app.post("/upload", upload.any(), (req, res) => {

  res.status(200).redirect("/ok");
});

app.post('/delete',async function(req,res){
  console.log("hi")
  console.log(req.body.name)
  
  await bucket.find({filename:req.body.name}).toArray((err,files)=>{
    
    bucket.delete(files[0]._id);
  
  });
  console.log("hi");
  res.status(201).json({user:"ok"})
  
 
    
})



app.get('/ok',(req,res)=>{
  res.send("HI");
})

const PORT = process.env.PORT | 1000;

app.listen(PORT, () => {
    console.log(`Application live on localhost:{process.env.PORT}`);
});

});