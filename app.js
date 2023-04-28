const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

//
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema
const articleSchema = {
  title: String,
  content: String,
};
// Create a model
const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find().then((foundArticles, err) => {
      foundArticles.length === 0
        ? res.send("No articles found")
        : err
        ? res.send(err)
        : res.send(foundArticles);
    });
  })
  .post((req, res) => {
    const { title, content } = req.body;
    Article.find({ title }).then((articles) => {
      if (articles.length === 0) {
        const newArticle = new Article({
          title,
          content,
        });
        newArticle.save();
        res.send("Article added successfully");
      } else {
        res.send("Article already exists");
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany().then((response) => {
      res.send(response);
    });
  });

app
  .route("/articles/:title")
  .get((req, res) => {
    const { title } = req.params;
    Article.findOne({ title }).then((articleFound, err) => {
      err && console.log(err);
      articleFound ? res.send(articleFound) : res.send("No article found");
    });
  })
  .put((req, res) => {
    const { titleFromUrl } = req.params;
    const { title, content } = req.body;
    Article.updateOne(
      { titleFromUrl },
      { title, content },
      { returnOriginal: 1 }
    ).then((response) => {
      res.send(response);
    });
  })
  .delete((req, res) => {
    const { title } = req.params;
    Article.deleteOne({ title }).then((response) => {
      res.send(response);
    });
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
