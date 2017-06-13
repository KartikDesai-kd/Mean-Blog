var express = require('express');
var app=express();

var bodyParser=require('body-parser');

const mongoose=require('mongoose');

mongoose.connect('mongodb://kartik:kartik.kd@ds153501.mlab.com:53501/user');

var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});

var router = express.Router();

var PostSchema=mongoose.Schema({
    title:{type:String,require:true},
    body:String,
    tag:{type:String,enum:['POLITICS','ECONOMY','EDUCATION']},
    posted:{type:Date,default:Date.now},
    file:Object
});

var PostModel=mongoose.model("PostModel",PostSchema);


app.use(express.static(__dirname+'/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get("/api/blogpost",getAllPosts);
app.delete("/api/blogpost/:id",deletePost);
app.get("/api/blogpost/:id",getPostById);
app.put("/api/blogpost/:id",updatePost);

/**
 * Create's the file in the database
 */
app.post('/api/blogpost', upload.single('file'), function (req, res, next) {
  console.log("data: "+req);  
  console.log(req.body);
  console.log("file: "+req.file);
  var newUpload = {
    title: req.body.title,
    body:req.body.body,
    posted: Date.now(),
    file: req.file
  };
  PostModel.create(newUpload, function (err, next) {
    if (err) {
      next(err);
    } else {
      res.send(newUpload);
    }
  });
});

function updatePost(req,res){
    var postId=req.params.id;
    var post=req.body;
    PostModel
          .update({_id:postId},{
             title:post.title,
             body:post.body
          })
          .then(
              function(status){
                  res.sendStatus(200);
              },
              function(err){
                  res.sendStatus(400);
              }
          );
}
function getPostById(req,res){
    var postId=req.params.id;
    PostModel
          .findById(postId)
          .then(
              function(post){
                  res.json(post);
              },
              function(err){
                  res.sendStatus(400);
              }
          );
}

function deletePost(req,res){
   var postId=req.params.id;
   PostModel
           .remove({_id:postId})
           .then(
                function(status){
                      res.sendStatus(200);
                },
                function(){
                      res.sendStatus(400);
                }
           );
}

function getAllPosts(req,res){
   PostModel.find({},  function (err, uploads) {
    if (err) next(err);
    else {
      res.send(uploads);
    }
  });
}



app.listen(3000);