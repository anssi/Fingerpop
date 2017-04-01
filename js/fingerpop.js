var stripUrl = "http://www.hs.fi/fingerpori";
var animationSpeed = 100;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;

var previousButton = ""
var nextButton = "";
var currentUrl = "http://www.hs.fi/fingerpori";
var previousUrl = "";
var nextUrl = "";
var latestUrl = "";

function updateView(url) {
	$("#strip").addClass("loading");
	$("#strip img").fadeOut(animationSpeed, function () {
		$(this).remove();
	});
	
	if (url.indexOf("http://www.hs.fi") != 0) {
		url = "http://www.hs.fi" + url;
	}
	currentUrl = url;
	var jqxhr = $.get(url, function(data) {
		parseData(data);
	})
	.error(function () { $("#header").text("Error loading Fingerpori!"); });
}

function parseData(data) {
	var stripImageSrc = $($("figure.cartoon img", data)[0]).data('original');
	var stripDate = $("header.cartoon-header span.date", data).text();

  if (stripImageSrc.indexOf("//") == 0) {
    stripImageSrc = "http:" + stripImageSrc;
  }

	$("#header span.strip_date").html(stripDate);
	updateStripImage(stripImageSrc);
	updateNavigation(data);
}

function updateStripImage(stripImageSrc) {
	var stripImage = new Image();
	$(stripImage).load(function () {
		$("#strip").removeClass("loading");
		$(this).hide();
		$(this).offset($("#strip").offset());

    var imgWidth = stripImage.width;
    var imgHeight = stripImage.height;
    if (imgWidth > 500) {
      var ratio = imgWidth / 500;
      imgWidth = Math.round(imgWidth / ratio);
      imgHeight = Math.round(imgHeight / ratio);
    }
		$("#strip").animate({
			width: imgWidth + "px",
			height: imgHeight + "px"
		}, 100, function () {
			$("#strip").append(stripImage);
			$(stripImage).fadeIn(animationSpeed);
		});
	})
	.attr("src", stripImageSrc)
	;
}

function updateNavigation(data) {
	previousButton = $(".cartoon a.prev", data);
	nextButton = $(".cartoon a.next", data)
	previousUrl = "";
	nextUrl = "";
	if (!previousButton.hasClass("disabled")) {
		previousUrl = previousButton.attr("href");
	} else {
		previousUrl = "";
	}
	
	if (!nextButton.hasClass("disabled")) {
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

function discoverLatestStrip() {
  var latestStripUrl;
	$.get(stripUrl, function (data) {
		latestStripUrl = "http://www.hs.fi" + $($('.cartoon .list-item .cartoon-content a', data)[0]).attr('href');
    updateView(latestStripUrl);
	});
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
		chrome.tabs.create({url: currentUrl});
	});

  setTimeout(function () {discoverLatestStrip();}, 1);
});