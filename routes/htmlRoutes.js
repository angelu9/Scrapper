var exphbs = require("express-handlebars");

module.exports = function(app, db) {

    app.get("/", function(req, res) {
        db.Article.find({ saved: false })
          .then(function(dbArticle) {

            console.log(dbArticle);

            var data = {
              dbArticle: dbArticle
            };

            res.render("index", data);
          })
          .catch(function(err) {
            console.log(err);
            res.json(err);
          });
      });

    app.get("/saved", function(req, res) {
      db.Article.find({ saved: true })
        .then(function(dbArticle) {
          var data = {
            dbArticle: dbArticle
          };
          res.render("saved", data);
        });
    });
      
    app.get("/articles/:id", function(req, res) {
        db.Article.findOne({ _id: req.params.id })
          .populate("note")
          .then(function(dbArticle) {
            res.json(dbArticle);
          })
          .catch(function(err) {
            res.json(err);
          });
      });
};