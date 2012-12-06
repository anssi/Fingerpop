var stripUrl = "http://www.hs.fi/fingerpori";
var animationSpeed = 100;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;

var previousButton = ""
var nextButton = ""
var previousUrl = "";
var nextUrl = "";

function updateView(url) {
	$("#strip").addClass("loading");
	$("#strip img").fadeOut(animationSpeed, function () {
		$(this).remove();
	});
	
	if (url.indexOf("http://www.hs.fi") != 0) {
		url = "http://www.hs.fi" + url;
	}
	var jqxhr = $.get(url, function(data) {
		parseData(data);
	})
	.error(function () { $("#header").text("Error loading Fingerpori!"); });
}

function parseData(data) {
	var stripImageSrc = ""
	$("#full-comic div img", data).each(function () {
		var imageUrl = $(this).attr("src");
		if (imageUrl.indexOf("sarjis") > 0) {
			stripImageSrc = imageUrl;
		}
	});
	var stripDate = $("#full-comic .comic-date", data).text();
	$("#header").html("Fingerpori " + stripDate);
	updateStripImage(stripImageSrc);
	updateNavigation(data);
}

function updateStripImage(stripImageSrc) {
	var stripImage = new Image();
	$(stripImage).load(function () {
		$("#strip").removeClass("loading");
		$(this).hide();
		$(this).offset($("#strip").offset());
		$("#strip").animate({
			width: stripImage.width + "px",
			height: stripImage.height + "px"
		}, 100, function () {
			$("#strip").append(stripImage);
			$(stripImage).fadeIn(animationSpeed);
		});
	})
	.attr("src", stripImageSrc)
	;
}

function updateNavigation(data) {
	previousButton = $(".comic-nav a.prev-cm", data);
	nextButton = $(".comic-nav a.next-cm", data)
	previousUrl = "";
	nextUrl = "";
	if (!previousButton.hasClass("prev-cm-disabled")) {
		previousUrl = previousButton.attr("href");
	} else {
		previousUrl = "";
	}
	
	if (!nextButton.hasClass("next-cm-disabled")) {
		nextUrl = nextButton.attr("href");	
	} else {
		nextUrl = "";
	}
	
	if (previousUrl.length > 0) {
		$("#nav_prev").show();
		$("#nav_prev").unbind();
		$("#nav_prev").click(function () {
			updateView(previousUrl);
		});
	} else {
		$("#nav_prev").hide();
	}
	
	if (nextUrl.length > 0) {
		$("#nav_next").show();
		$("#nav_next").unbind();
		$("#nav_next").click(function () {
			updateView(nextUrl);
		});
	} else {
		$("#nav_next").hide();
	}
}

$(function() {

	$(document).bind('mousedown.disableTextSelect', function() {
		return false;
	});
	
	$(document).keyup(function (event) {
		if (event.keyCode === LEFT_ARROW && previousUrl.length > 0) {
			updateView(previousUrl);
		} else if (event.keyCode === RIGHT_ARROW && nextUrl.length > 0) {
			updateView(nextUrl);
		}
	});
	
	$("#strip").click(function() {
		chrome.tabs.create({url: "http://www.hs.fi/fingerpori"});
	});
	setTimeout(function () {updateView(stripUrl);}, 1);
});