//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios').default;
const ejs = require("ejs");
const mongoose = require('mongoose');
var fileId = mongoose.Types.ObjectId();
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Vinuvarghese:06@11993Univ@cluster0.xdoivax.mongodb.net/WikiDB", {useNewUrlParser: true})

const articleSchema ={
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);




app.get("/",function(req,res){
  res.render('home.ejs');
})

app.get("/articles/edit/:id",function(req,res){
  var a =mongoose.Types.ObjectId(req.params.id);

  Article.findOne({_id:a}, function(err, foundArticles){
    //console.log(a);
    //console.log(foundArticles);
    //console.log(req.params.id);
    if (!err) {

    res.render('edit',{data:foundArticles});
  } else {
    res.send(err);
  }
  });
})

app.post("/edit/:id",function(req,res){
  var a =mongoose.Types.ObjectId(req.params.id);
  console.log(a);
  console.log(req.body.title);
  Article.updateOne({_id:a},{

    $set:req.body},function(err, foundArticles){
      console.log(foundArticles);
    }

  );
res.redirect("/articles")
})

app.post("/articles/delete/:id",function(req, res){
var a =mongoose.Types.ObjectId(req.params.id);
console.log(a);
  Article.deleteOne(
    {_id:a},
    function(err){
      if (!err){
        res.redirect("/articles");
      } else {
        res.send(err);
      }
    }
  );
});

app.post("/delete",function(req, res){

  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

app.route("/articles")


.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err) {
    //res.send(foundArticles);
    res.render('index',{data:foundArticles});
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
//console.log(title);
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})







app.listen(process.env.PORT||3000);
