//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const {Schema} = mongoose;
mongoose.connect("mongodb://localhost:27017/blogDB");

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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
