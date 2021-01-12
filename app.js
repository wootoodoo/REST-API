const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
// let urlencodedParser = bodyParser.urlencoded({extended: true});
app.use(express.static("public"));

//Set up mongoose DB
mongoose.connect("mongodb://localhost:27017/wikiDB" , {useNewUrlParser:true, useUnifiedTopology: true});

const articleSchema = {
    title: {
        type: String,
        required: [true, "you need to enter a title"]
    },
    content: {
        type: String,
        required: [true, "you need to enter some content"]
    }
}

const Article = mongoose.model("Article", articleSchema);

/////////////////// Requests targetting all articles /////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, results) => {
            if (err) res.send(err);
            else {
                res.send(results);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article");
            } 
            else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("successfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

/////////////////// Requests targetting specific article /////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found");
            }
        });
    })
    .post((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err, results) => {
                if (!err) res.send("Successfully updated article");
            });
    })
    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            { $set: req.body},
            (err) => {
                if (!err) {
                    res.send("Successfully updated article");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle}, (err) => {
            if (!err) {
                res.send("Successfully deleted the article")
            } else {
                res.send(err);
            }
        });
    });


app.listen(port, (req, res) => {
    console.log("listening on port " + port);
});