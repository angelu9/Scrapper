var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

module.exports = function(app, db) {

    app.get("/api/scrape", function(req, res) {

        axios.get("http://www.ign.com/articles?tags=news").then(function(response) {
            
            var $ = cheerio.load(response.data);

            $(".listElmnt-blogItem").each(function(i, element) {
                console.log(i);
                var result = {};
                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");
                result.body = $(this)
                    .children("p")
                    .text();
                    console.log(result);

                db.Article.create(result)
                    .then(function(dbArticle) {
                        res.end();
                    })
                    .catch(function(err) {
                        return res.json(err);
                    });
            });
        });
    });

    app.get("/api/articles/:saved", function(req, res) {

        db.Article.find({ saved: req.params.saved })
            .then(function(dbArticle) {
            res.send(dbArticle);
        });
    });

    app.put("/api/save/:id", function(req, res) {

        console.log(req.body);

        db.Article.findOneAndUpdate({_id: req.params.id}, { saved: req.body.save }).then(function(response) {
            res.end();
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.post("/api/notes/save/:id", function(req, res) {

        db.Note.create(req.body)
            .then(function(dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {note: dbNote._id }}, { new: true });
            })
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    app.get("/api/notes/:id", function(req, res) {

        console.log(req.params.id);
        
        db.Article.find({ _id: req.params.id }).then(function(dbArticle) {
            
            console.log(dbArticle);

            db.Note.find({ _id: { $in: dbArticle[0].note }}).then(function(notes) {

                console.log(notes);

                res.send(notes);
            });

        });
    });

   
};