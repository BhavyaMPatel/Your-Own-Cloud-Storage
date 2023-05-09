const port = 3000
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const {GridFsStorage} = require("multer-gridfs-storage");
const ejs = require("ejs");
const multer  = require('multer')
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const username = encodeURIComponent("BhavyaMPatel");
const password = encodeURIComponent("BhavyaMPatel@1462*");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const mongoURI=`mongodb+srv://${username}:${password}@bhavya.k6nfals.mongodb.net/?retryWrites=true&w=majority`

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let gfg;

conn.once("open", () => {
  // init stream
  gfg = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: "test"});
});

const storage = new GridFsStorage({
  url: mongoURI,
  // file: (req, file) => {
  //   return new Promise((resolve, reject) => {
  //     // crypto.randomBytes(16, (err, buf) => {
  //       // if (err) {
  //       //   return reject(err);
  //       // }
  //       // const filename = buf.toString("hex") + path.extname(file.originalname);
  //       const fileInfo = {
  //         filename: file.originalname,
  //         bucketName: "uploads"
  //       };
  //       resolve(fileInfo);
  //     // });
  //   });
  // }
});


// var gfs = Grid(db, mongo);
// console.log(gfs);


//Handle The Files 
// const storage = multer.diskStorage({

//     destination: function (req, file, cb) {
//       if(file.fieldname=="file"){
//         cb(null,'./uploads/files/')
//       }else if(file.fieldname=="image"){
//         cb(null, './uploads/images/')
//       }else if(file.fieldname=="videos"){
//         cb(null, './uploads/videos/')
//       }
//     },
//     filename: function (req, file, cb) {
//     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.originalname)
//     }
// })

const upload = multer({ storage})


app.get('/', (req, res) => {
  // res.render('home');

  // if(!gfs) {
  //   console.log("some error occured, check connection to db");
  //   res.send("some error occured, check connection to db");
  //   process.exit(0);
  // }
  test.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.render("home", {
        files: false
      });
    } else {
      const f = files
        // .map(file => {
        //   if (
        //     file.contentType === "image/png" ||
        //     file.contentType === "image/jpeg"
        //   ) {
        //     file.isImage = true;
        //   } else {
        //     file.isImage = false;
        //   }
        //   return file;
        // })
        // .sort((a, b) => {
        //   return (
        //     new Date(b["uploadDate"]).getTime() -
        //     new Date(a["uploadDate"]).getTime()
        //   );
        // });
      return res.render("home", {files: f });
    }
  });







})  

app.post('/files',upload.any(),(req, res) => {
    console.log(req.files)
    // var writeStream = gfs.createWriteStream({
    //   filename: req.files.filename
    // });
    // writeStream.on('close', function (file) {
    //   res.send(`File has been uploaded ${file._id}`);
    // });
    // req.pipe(writeStream);
})


app.get("/file/:filename", (req, res) => {
  // console.log('id', req.params.id)
  const file = gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist"
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// <!-- <% if(files) { %>
//         <% files.forEach(function(file) {%>
//         <div class="card mb-3">
//             <div class="card-header">
//                 <div class="card-title">
//                         <%= file.filename %>
//                 </div>
//             </div> -->
//             <!-- <div class="card-body">
//                 <% if (file.isImage) { %>
//             <img src="image/<%= file.filename %>" width="250" alt="" class="img-responsive">
//                 <%} else { %>
//                 <p><% file.filename %></p>
//                 <% } %>
//             </div> -->