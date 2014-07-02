$(document).ready(function ($) {
	
    /*
     * Home page and global functionality
    **/
    // Homepage Work Slideshow
    if ($('body.home').length > 0) {
        $('#slideshow').cycle({
            fx: 'fade',
            timeout: 8000,
            pause: 1,
            pager: "#slideshow-pager",
            random: true
        });
    }

    // Live Tweets from Arc90:
    $("#tweets-content-from").tweet({
        username: "arc90",
        count: 10,
        loading_text: "Loading Arc90&#39;s latest tweets&hellip;"
    });

    // Local Tweets & Quotes:
    // Twitter Slideshow Tabs
    $("#tweets-tab-about").click(function () {
        $("#tweets-tab-from").removeClass("active");
        $("#tweets-content-from").hide();

        $(this).addClass("active");
        $("#tweets-content-about").show();
    });

    $("#tweets-tab-from").click(function () {
        $("#tweets-tab-about").removeClass("active");
        $("#tweets-content-about").hide();

        $(this).addClass("active");
        $("#tweets-content-from").show();
    });


    /*
     * Events for single page posts.
    **/
    if ($('body.single-post').length > 0) {
		$('#commentform').find('label').labelOver('over');
	    $('#searchform').find('label').labelOver('over');
    }

    /*
     * Individual page effects & interactions
    **/
    // Work Page
    if ($('body#work').length > 0) {
        // Thumbnail switcher for client slideshows.
        $(".thumbnails li img").click(function () {
            var thisImage = $(this).attr("class"),
                client = thisImage.split("-"),
                fullPicLi = "#" + client[0] + " .fullpics ." + thisImage,
                otherItems = "#" + client[0] + " .fullpics li";

            $(otherItems).attr("style","");

            $(fullPicLi).css({
                "position" : "absolute",
                "top" : "0",
                "left" : "0",
                "z-index":"1000"
            });
        });
    }

    /*
     * Team Page Events
    **/
    if ($('body#team').length > 0) {
        // Tags Meta Filter
        var employeeLIs = $("#employees > li"),
            tagFilters  = $("#tag-filter a");

        tagFilters.click(function () {
            // If already active, remove the filter
            if ($(this).hasClass("active")) {
				//console.log(this.id);
                tagFilters.removeClass("active");
				//console.log(employeeLIs);
                employeeLIs.addClass("active");
            }
            // Otherwise, only show matching tags
            else {
                var tagName = "." + $(this).attr("id");

                tagFilters.removeClass("active");

                employeeLIs.removeClass("active");
                $(this).addClass("active");
                employeeLIs.find(".infoBubble").parents(".employee").addClass("gray");
                employeeLIs.find(tagName).parents(".employee").addClass("active");
				console.log(employeeLIs.find(tagName));
                employeeLIs.find(tagName).parents(".employee").removeClass("gray");
            }
        });

        // Staff Headshot Rollovers
        employeeLIs.find(".headshot").mouseenter(
            function () {
                var thisEmployee = $(this).parent();

                employeeLIs.find('.infoBubble').hide();

                thisEmployee.find('.infoBubble').fadeIn("fast");

                // Reobert Petro's Animation
                if (thisEmployee.find('.infoBubble h4').text() === "join us") {

                    var robsId = "#" + thisEmployee.attr('id');
                    $("#employees > li:not(" + robsId + ")").addClass('notPetro', 2000);
                }
            }
        ).mouseleave(
            function () {
                var thisEmployee = $(this).parent();

                employeeLIs.find(".infoBubble").hide();

                $(employeeLIs).removeClass('notPetro');
            }
        );
    }

    // Initiate colorbox if it has been included on the page
    // Only included on the 'work' page
    if ( $.colorbox ) {
        $('a.colorbox').colorbox({rel:'gal'});
    }

    // Functionality to show/hide technologies we use - work page
    // Show all technologies associated with the client being hovered on
    $('.client-tech').mouseenter(function() {
        // save the client name and list of technologies
        var client = $(this).text().toLowerCase(),
            techList = $('#tech-list li');

        //cycle through each list item and determine if it has a class of the hovered client.
        //if it doesn't, give it a class of 'not-included'
        $.each(techList, function() {
            $(this).not("."+client).addClass('not-included');
        });
    }).mouseleave(function(){ //remove all occurences of the "tech-active" class on mouseout
        $(".not-included").removeClass('not-included');
    });



}); // End Document.ready