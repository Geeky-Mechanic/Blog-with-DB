//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const {Schema} = mongoose;
mongoose.connect("mongodb+srv://jaychamp:Alex181818@cluster0.cwe88.mongodb.net/blogDB?retryWrites=true&w=majority");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/* ---->  create schema  <---- */
const blogSchema = new Schema({
title: {
type: String
},
text: {
type: String
}
});
/* ---->  create model  <---- */
const Blog = new mongoose.model('Blog', blogSchema);

const homeStartText = new Blog({
  text: "Welcome to my blog, feel free to contact me and share what you think about this!"
});

const contactText = new Blog({
  text: "Contact me with my email : me@hotmail.com!"
});

const aboutText = new Blog({
  text: "I'm just a beginning dev trying to do his best!"
});

let Defaultposts = [homeStartText, aboutText, contactText];

app.get("/", function(req, res){

  Blog.find({}, function(err, allBlogs){

      res.render("home", {
        startingContent: homeStartText.text,
        posts: allBlogs
        });
  }); 
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutText});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactText});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Blog ({
    title: req.body.postTitle,
    text: req.body.postBody
  });

  post.save(function(err, blogs){
  if(err){
  console.log(err);
  }else {
  res.redirect("/");
  }
  });

});

app.get("/posts/:postName", function(req, res){

    const title = req.params.postName;
    Blog.findOne({title: title}, function(err, blogPost){
      if(err){
        console.log(err);
      }else{
        res.render("post", {
        title: blogPost.title,
        content: blogPost.text
        });
      }
    });

});

app.listen(process.env.PORT ||3000, function() {
  console.log("Server started on port 3000");
});
