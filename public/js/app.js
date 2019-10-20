$(document).ready(function() {


    //Home Page Events//
    $('.scrape').on('click', newScrape);
    $('.clear').on('click', clearArticles);
    $(document).on('click', '.save', saveArticle);
    //Saved Page Events//
    $(document).on('click', '.removeSaved', removeSaved);
    $(document).on('click', '.viewNotes', viewNotes);
    $(document).on('click', '.saveNote', saveNote);


    //Home Page Functions//
    function newScrape() {

        $.get("/api/scrape", function(data, err) {
            console.log(data);
            getArticles(false);
        }).catch(function(err) {
            console.log(err);
        });        
    };

    function getArticles(saved) {

        $.get("/api/articles/" + saved, function(data) {
            console.log("get Articles");
            renderArticles(data);
        });
    };

    function renderArticles(articles) {

        articles.forEach(function(article) {

            console.log(article);

            var card = $("<div class='card'>");
                card.data("_id", article._id);
            var cardHeader = $("<div class='card-header'>").append(
                $("<h3>").append(
                    $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                        .attr("href", article.link)
                        .text(article.title),
                        $("<a class='btn btn-success save'>Save Article</a>")
                    )
                );
            var cardBody = $("<div class='card-body'>").text(article.body);

            card.append(cardHeader, cardBody);
  
            $('.articleDrop').append(card);
        });
    };

    function clearArticles() {

        $('.card').remove();

    };

    function saveArticle() {

        var saveId = $(this).parents(".card").data();
            saveId = saveId._id;
        var save = {
            save: true
        };

        $(this).parents(".card").remove();

        $.ajax({
            method: "PUT",
            url: "/api/save/" + saveId,
            data: save
        }).then(function(result) {
            if(result.saved) {
                getArticles(false);
            };
        });

    };

    //Saved Page Functions//
    function removeSaved() {

        var saveId = $(this).parents(".card").data();
            saveId = saveId._id;
        var save = {
            save: false
        };

        $(this).parents(".card").remove();

        $.ajax({
            method: "PUT",
            url: "/api/save/" + saveId,
            data: save
        }).then(function(result) {
            if(result.saved) {
                getArticles(true);
            };
        });
    };

    function viewNotes() {

        var saveId = $(this).parents(".card").data();
            saveId = saveId._id;

            console.log(saveId);
            
        $.get("/api/notes/" + saveId).then(function(data) {

            var button = $("<button class='btn btn-success saveNote'>Save Note</button>")
                button.val(saveId);
            var modalText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text("Notes For Article: " + saveId),
                $("<hr>"),
                $("<ul class='list-group note-container'>"),
                $("<textarea id='title' placeholder='New Note Title' rows='1' cols='60'>"),
                $("<textarea id='body' placeholder='New Note' rows='4' cols='60'>"),
                button
            );
              
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });

            var notes = {
                _id: saveId,
                notes: data || []
            };

            console.log(data);
            console.log(notes);
              
            $(".btn.save").data("article", notes);
             
            renderNotes(notes);
        });
    };
        
    function renderNotes(data) {
        var notes = [];
        var currentBody;
        var currentTitle;
        var note = $("<li class='list-group-item title'>");

        if (!data.notes.length) {
          note = $("<li class='list-group-item'>No notes for this article yet.</li>");
          notes.push(currentBody);
        } else {
        
          for (var i = 0; i < data.notes.length; i++) {
            
            note.append(
                currentTitle = $("<li class='list-group-item title' rows='1'>")
                    .text(data.notes[i].title),
                currentBody = $("<li class='list-group-item note'>")
                    .text(data.notes[i].body)
                    .append($("<button class='btn btn-danger note-delete'>x</button>"))
            );
 
            note.children("button").data("_id", data.notes[i]._id);    
            notes.push(note);
          }
        }
        $(".note-container").append(notes);
    };

    function saveNote() {

        var articleId = $(this).val().trim();
        var noteData;
        var newNote = $(".bootbox-body #body").val().trim();
        var newTitle = $(".bootbox-body #title").val().trim();
        if (newNote) {
            noteData = { 
                title: newTitle,
                body: newNote 
            };
            $.post("/api/notes/save/" + articleId, noteData).then(function() {

                bootbox.hideAll();
            });
        }
    };

    function deleteNote() {

    };


});